import { Instance } from "../../types/instance";
import { Plugin } from "../../types/options";

export interface Config {
  selectTimeText?: string;
  dateFormat?: string;
  datetimeFormat?: string;
  dateOnlyFieldId?: string;
  dateOnlyClassName?: string;
  showAlways?: boolean;
  timeRequired?: boolean;
  theme?: string;
  rangeStatus?: boolean | undefined;
}

const defaultConfig: Config = {
  selectTimeText: "Select Time... ",
  dateFormat: "m/d/Y",
  datetimeFormat: "m/d/Y h:iK",
  dateOnlyFieldId: "",
  dateOnlyClassName: "dateonly",
  showAlways: false,
  timeRequired: false,
  theme: "light",
};

function selectTimePlugin(pluginConfig: Config): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };
  let safetyNet: HTMLDivElement;
  let selectTimeContainer: HTMLDivElement;
  let clearTimeContainer: HTMLDivElement;
  let dateOnlyFlagElement: HTMLInputElement;

  return function(fp: Instance) {
    const setEnableTime = () => {
      if (dateOnlyFlagElement) {
        dateOnlyFlagElement.value = "0";
      }
      fp.selectedDates.map((sd: Date, index) => {
        if (
          (index === 0 &&
            config.rangeStatus === false &&
            fp.config.mode === "range") ||
          config.rangeStatus === true
        ) {
          sd.setHours(0, 0, 0);
        }
        if (
          (index === 1 &&
            config.rangeStatus === true &&
            fp.config.mode === "range") ||
          config.rangeStatus === false
        ) {
          sd.setHours(23, 59, 59);
        }
        return sd;
      });
      fp.set("enableTime", true);
      fp.set("dateFormat", config.datetimeFormat);
      fp.setDate(fp.selectedDates, true, config.datetimeFormat);
      fp.showTimeInput = true;

      if (fp.timeContainer) {
        fp.timeContainer.classList.remove("unselected");
      }
      clearTimeContainer.style.display = "";
      clearTimeContainer.classList.add("visible");
      selectTimeContainer.style.display = "none";
      selectTimeContainer.classList.remove("visible");
      if (config.dateOnlyClassName) {
        fp._input.classList.remove(config.dateOnlyClassName);
      }
    };
    const setDisableTime = () => {
      if (dateOnlyFlagElement) {
        dateOnlyFlagElement.value = "1";
      }
      fp.selectedDates.map((sd: Date) => {
        if (config.rangeStatus === true) {
          sd.setHours(0, 0, 0);
        }
        if (config.rangeStatus === false) {
          sd.setHours(23, 59, 59);
        }
        return sd;
      });
      fp.set("enableTime", false);
      fp.set("dateFormat", config.dateFormat);
      fp.setDate(fp.selectedDates, true, config.dateFormat);
      fp.showTimeInput = false;
      fp.redraw();
      if (fp.timeContainer) {
        fp.timeContainer.classList.add("unselected");
      }
      selectTimeContainer.style.display = "";
      selectTimeContainer.classList.add("visible");
      clearTimeContainer.style.display = "none";
      clearTimeContainer.classList.add("visible");
      if (config.dateOnlyClassName) {
        fp._input.classList.add(config.dateOnlyClassName);
      }
    };
    const safetyClose = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fp.close();
    };
    if (fp.config.noCalendar || fp.isMobile) return {};
    return {
      onParseConfig() {
        if (
          typeof config.dateOnlyFieldId === "string" &&
          config.dateOnlyFieldId !== ""
        ) {
          dateOnlyFlagElement = window.document.getElementById(
            config.dateOnlyFieldId
          ) as HTMLInputElement;
        }

        fp.set(
          "dateFormat",
          config.timeRequired ? config.datetimeFormat : config.dateFormat
        );
      },
      onKeyDown(_: Date[], __: string, ___: Instance, e: KeyboardEvent) {
        if (fp.config.enableTime && e.key === "Tab" && e.target === fp.amPM) {
          e.preventDefault();
          selectTimeContainer.focus();
        } else if (e.key === "Enter" && e.target === selectTimeContainer)
          fp.close();
      },
      onOpen() {
        if (fp.calendarContainer.parentElement) {
          safetyNet = fp._createElement<HTMLDivElement>(
            "div",
            "flatpickr-selectTime__safety-net"
          );
          safetyNet.tabIndex = -1;
          safetyNet.addEventListener("click", safetyClose);
          fp.calendarContainer.parentElement.insertBefore(
            safetyNet,
            fp.calendarContainer.parentElement.firstChild
          );
        }
      },
      onClose() {
        if (fp.calendarContainer.parentElement && safetyNet) {
          safetyNet.removeEventListener("click", safetyClose);
          fp.calendarContainer.parentElement.removeChild(safetyNet);
        }
      },
      onReady() {
        if (fp.timeContainer && !config.timeRequired) {
          fp.timeContainer.classList.add("unselected");
        }

        selectTimeContainer = fp._createElement<HTMLDivElement>(
          "div",
          `flatpickr-selectTime ${
            config.showAlways && !config.timeRequired ? "visible" : ""
          } ${config.theme}Theme`,
          config.selectTimeText
        );

        selectTimeContainer.tabIndex = -1;
        selectTimeContainer.addEventListener("click", setEnableTime);
        fp.calendarContainer.appendChild(selectTimeContainer);

        clearTimeContainer = fp._createElement<HTMLDivElement>(
          "div",
          `flatpickr-selectTime__clear ${
            config.showAlways && !config.timeRequired ? "" : "visible"
          } ${config.theme}Theme`,
          "Clear Time"
        );

        clearTimeContainer.tabIndex = -1;
        clearTimeContainer.addEventListener("click", setDisableTime);
        fp.calendarContainer.appendChild(clearTimeContainer);
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
