const INPUT_SECTION_CLASS = 'jp-Scheduler-form-input-section';

// const INPUT_LABEL_CLASS = 'jp-Scheduler-form-input-label';

const INPUT_CLASS = 'jp-mod-styled';


interface InputConfig {
  inputType: 'input'|'select';
  id: string;
  label?: string;
  placeholder?: string;
}

function createInput(config: InputConfig): HTMLElement {
  const inputSectionNode = document.createElement('div');
  inputSectionNode.className = INPUT_SECTION_CLASS;

  // Create label element
  if (config.label) {
    const labelNode = document.createElement('span');
    labelNode.textContent = config.label;
    inputSectionNode.appendChild(labelNode);
  }

  // Create input element
  const inputNode = document.createElement(config.inputType);
  inputNode.setAttribute('id', config.id);
  if (config.placeholder) {
    inputNode.setAttribute('placeholder', config.placeholder);
  }
  inputNode.className = INPUT_CLASS;

  inputSectionNode.append(inputNode);

  return inputSectionNode;
}

export {InputConfig, createInput};
