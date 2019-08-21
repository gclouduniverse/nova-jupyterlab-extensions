import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';
import * as React from 'react';

import { GcpService } from '../service/gcp';
import { SchedulerDialog, LaunchSchedulerRequest } from './dialog';

/**
 * Wraps a LaunchSchedulerRequest in a Signal to be able to update the
 * GcpSchedulerWidget when the value changes upon user action.
 */
export class GcpSchedulerContext extends VDomModel {
  private request: LaunchSchedulerRequest;

  get value(): LaunchSchedulerRequest {
    return this.request;
  }

  set value(action: LaunchSchedulerRequest) {
    this.request = action;
    this.stateChanged.emit();
  }
}

/** Phosphor Widget responsive to changes in the NotebookContext */
export class GcpSchedulerWidget extends VDomRenderer<GcpSchedulerContext> {

  constructor(private gcpService: GcpService,
    readonly model: GcpSchedulerContext) {
    super();
  }

  protected render() {
    return <SchedulerDialog gcpService={this.gcpService}
      request={this.model.value} />;
  }
}
