import {DOMUtils} from '@jupyterlab/apputils';
import {Widget} from '@phosphor/widgets';

import {GcpService} from '../service/gcp';
import {createInput} from '../util/createInput';

const WIDGET_CLASS = 'jp-Jobs';

const INNER_FRAME_CLASS = 'jp-Scheduler-inner-frame';

const HEADER_CLASS = 'jp-Scheduler-header';

const CONTENT_CLASS = 'jp-Scheduler-content';

const FORM_CLASS = 'jp-Scheduler-form';

export class SchedulerForm extends Widget {
  /**
   * Create a redirect form.
   */
  constructor(private gcpService: GcpService) {
    super({node: SchedulerForm.createFormNode()});

    this.addClass(WIDGET_CLASS);
    this.populateHeaderNode(DOMUtils.findElement(this.node, HEADER_CLASS));
    this.populateContentNode(DOMUtils.findElement(this.node, CONTENT_CLASS));
  }

  private static createFormNode(): HTMLElement {
    const node = document.createElement('div');

    const header = document.createElement('div');
    header.className = HEADER_CLASS + ' ' + INNER_FRAME_CLASS;
    node.appendChild(header);

    const content = document.createElement('div');
    content.className = INNER_FRAME_CLASS + ' ' + CONTENT_CLASS;
    node.appendChild(content);

    return node;
  }

  // Populate header of scheduler to side panel.
  populateHeaderNode(node: HTMLElement): void {
    const HEADER_TEXT = 'SCHEDULE A NOTEBOOK RUN';

    const headerTextNode = document.createElement('b');
    headerTextNode.textContent = HEADER_TEXT;

    node.appendChild(headerTextNode);
  }

  /**
   *  Populate content of scheduler to side panel, content includes description
   *  and form.
   */
  populateContentNode(node: HTMLElement): void {
    const DESCRIPTION = `Schedule a notebook run and this notebook will be
                         automatically executed from the beginning to the end
                         based on the specified frequency. The finished
                         notebooks will be saved in a Cloud Storage bucket and
                         viewable from a dashboard. Using this feature will add
                         additional cost.`;
    const descriptionTextNode = document.createElement('div');
    descriptionTextNode.textContent = DESCRIPTION;

    const learnMoreNode = document.createElement('a');
    learnMoreNode.setAttribute('href', '');
    learnMoreNode.setAttribute('target', '_blank');
    learnMoreNode.textContent = 'Learn more';

    const descriptionNode = document.createElement('div');
    descriptionNode.appendChild(descriptionTextNode);
    descriptionNode.appendChild(learnMoreNode);

    node.appendChild(descriptionNode);
    this.populateFormNode(node);
  }

  populateFormNode(node: HTMLElement): void {
    const formNode = document.createElement('div');
    formNode.className = FORM_CLASS;

    const runNameInputNode = createInput(
        {inputType: 'input', id: 'runNameInput', label: 'Run name'});
    formNode.appendChild(runNameInputNode);

    const gcsInputNode = createInput(
        {inputType: 'input', id: 'bucketNameInput', label: 'GCS Path'});
    formNode.appendChild(gcsInputNode);

    const submitButton = document.createElement('input');
    submitButton.id = 'schedulerSubmit';
    submitButton.type = 'submit';
    submitButton.onclick = () => {
      const content =
          (document.getElementById('runNameInput') as HTMLInputElement).value;
      const path =
          (document.getElementById('bucketNameInput') as HTMLInputElement)
              .value;
      this.gcpService.uploadNotebook(content, path);
    };
    formNode.appendChild(submitButton);

    node.appendChild(formNode);
  }
}
