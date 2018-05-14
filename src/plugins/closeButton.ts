import { Instance } from "../types/instance";
import { Plugin } from "../types/options";

export interface Config {
  showAlways?: boolean;
}

const defaultConfig: Config = {
  showAlways: true,
};

function closeButtonPlugin(pluginConfig: Config): Plugin {
  const config = { ...defaultConfig, ...pluginConfig };
  let closeButtonContainer: HTMLAnchorElement;

  return function(fp: Instance) {
    return {
      onReady() {
        closeButtonContainer = fp._createElement<HTMLAnchorElement>(
          "a",
          `flatpickr__close`
        );

        closeButtonContainer.tabIndex = -1;
        closeButtonContainer.addEventListener("click", fp.close);
        closeButtonContainer.innerHTML +=
          '<span class="flatpickr__close-button">&#x2716;</span>';
        if (config.showAlways) {
          fp.calendarContainer.appendChild(closeButtonContainer);
        }
      },
    };
  };
}

export default closeButtonPlugin;
