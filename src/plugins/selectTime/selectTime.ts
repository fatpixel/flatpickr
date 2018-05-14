import { Instance } from "../../types/instance";
import { Plugin } from "../../types/options";

export interface Config {
  selectTimeText?: string;
  dateFormat?: string;
  datetimeFormat?: string;
  showAlways?: boolean;
  timeRequired?: boolean;
  theme?: string;
}

const defaultConfig: Config = {
  selectTimeText: "Select Time... ",
  dateFormat: "m/d/Y",
  datetimeFormat: "m/d/Y", // "m/d/Y h:iK",
  showAlways: false,
  timeRequired: false,
  theme: "light",
};

function selectTimePlugin(pluginConfig: Config): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };
  let selectTimeContainer: HTMLDivElement;
  let clearTimeContainer: HTMLAnchorElement;

  return function(fp: Instance) {
    const setEnableTime = () => {
      fp.set("enableTime", true);
      fp.set("dateFormat", config.datetimeFormat);
      fp.setDate(fp.selectedDates, false, config.datetimeFormat);
      fp.showTimeInput = true;
      if (fp.timeContainer && !config.timeRequired) {
        fp.timeContainer.classList.remove("unselected");
      }
      selectTimeContainer.style.display = "none";
    };
    if (fp.config.noCalendar || fp.isMobile) return {};
    return {
      onParseConfig() {
        if (config.timeRequired) {
          fp.set("dateFormat", config.datetimeFormat);
        }
      },
      onKeyDown(_: Date[], __: string, ___: Instance, e: KeyboardEvent) {
        if (fp.config.enableTime && e.key === "Tab" && e.target === fp.amPM) {
          e.preventDefault();
          selectTimeContainer.focus();
        } else if (e.key === "Enter" && e.target === selectTimeContainer)
          fp.close();
      },
      /*
      onValueUpdate(selectedDates: Date[]) {
        fp.set(
          "dateFormat",
          fp.utils.isDayBoundary(selectedDates[0])
            ? config.dateFormat
            : config.datetimeFormat
        );
        fp._input.value = fp.formatDate(selectedDates[0], fp.config.dateFormat);
      },
      */
      onReady() {
        if (fp.timeContainer && !config.timeRequired) {
          fp.timeContainer.classList.add("unselected");
          // fp.set("dateFormat", config.dateFormat);
          // fp.setDate(fp.selectedDates, true, config.dateFormat);
        }
        selectTimeContainer = fp._createElement<HTMLDivElement>(
          "div",
          `flatpickr-selectTime ${
            config.showAlways && !config.timeRequired ? "visible" : ""
          } ${config.theme}Theme`,
          config.selectTimeText
        );
        clearTimeContainer = fp._createElement<HTMLAnchorElement>(
          "a",
          `flatpickr-selectTime__clear ${
            config.showAlways && !config.timeRequired ? "" : "visible"
          } ${config.theme}Theme`,
          config.selectTimeText
        );

        selectTimeContainer.tabIndex = -1;
        selectTimeContainer.addEventListener("click", setEnableTime);
        fp.calendarContainer.appendChild(selectTimeContainer);
      },
      ...(!config.showAlways
        ? {
            onChange: function(_: Date[], dateStr: string) {
              const showCondition =
                fp.config.enableTime || fp.config.mode === "multiple";
              if (dateStr && !fp.config.inline && showCondition)
                return selectTimeContainer.classList.add("visible");
              selectTimeContainer.classList.remove("visible");
            },
          }
        : {}),
    };
  };
}

export default selectTimePlugin;
