import * as React from 'react';
import {SchedulerDescription} from './shared/scheduler_description';
import {TextInput} from './shared/text_input';
import {CheckboxInput} from './shared/checkbox_input';
import {SelectInput} from './shared/select_input';
import {REGIONS, SCHEDULE_TYPES, Option, findOptionByValue, getMachineTypeOptions, getGpuTypeOptions, MachineType, getGpuDataList, GpuData} from '../scheduler/data';

interface SchedulerFormState {
  shouldShowFrequency: boolean;
  shouldShowGpuCount: boolean;
  zoneOptions: Option[];
  machineTypeOptions: Option[];
  gpuTypeOptions: Option[];
  gpuCountOptions: Option[];
}

export class SchedulerForm extends React.Component<{}, SchedulerFormState> {
  private zoneInputRef: React.RefObject<HTMLSelectElement>;
  private machineTypeOptionsStore: MachineType[];
  private gpuDataStore: GpuData[];

  constructor(props: {}) {
    super(props);

    this.state = {
      shouldShowFrequency: false,
      shouldShowGpuCount: false,
      zoneOptions: [],
      machineTypeOptions: [],
      gpuTypeOptions: [],
      gpuCountOptions: [],
    }

    this.zoneInputRef = React.createRef();
    this.machineTypeOptionsStore = [];
    this.gpuDataStore = [];
  }

  render() {
    const checkboxLabel = `Submit all the files in "home/path/to/current/directory" with the notebook`;

    // TODO move config of input to const
    return (
      <div>
        <SchedulerDescription />
        <TextInput id="notebook-input" label="Notebook" />
        <CheckboxInput id="all-files-checkbox" label={checkboxLabel}></CheckboxInput>
        <TextInput id="run-name-input" label="Run name" />
        <SelectInput id="region-input" label="Region" options={REGIONS} onChange={(value: string) => this.onRegionChange(value)} />
        <SelectInput id="zone-input" label="Zone" options={this.state.zoneOptions} forwardedRef={this.zoneInputRef} onChange={(value: string) => this.onZoneChange(value)} />
        <SelectInput id="machine-type-input" label="Machine type" options={this.state.machineTypeOptions} onChange={(value: string) => this.onMachineTypeChange(value)} />
        <SelectInput id="gpu-type-input" label="GPU type" options={this.state.gpuTypeOptions} onChange={(value: string) => this.onGpuTypeChange(value)} />
        {this.state.shouldShowGpuCount && <SelectInput id="gpu-count-input" label="GPU count" options={this.state.gpuCountOptions} />}
        <SelectInput id="schedule-type-input" label="Type" onChange={(value: string) => this.onScheduleTypeChange(value)} options={SCHEDULE_TYPES} />
        {this.state.shouldShowFrequency && <TextInput id="frequencyInput" label="Frequency" />}
      </div>
    );
  }

  onRegionChange(selectedRegion: string) {
    this.setState({
      zoneOptions: findOptionByValue(REGIONS, selectedRegion).zones
    });
  }

  onZoneChange(selectedZone: string) {
    this.machineTypeOptionsStore = getMachineTypeOptions(selectedZone);
    this.setState({
      machineTypeOptions: this.machineTypeOptionsStore
    });
  }

  onMachineTypeChange(selectedMachineType: string) {
    const selectedZone = this.zoneInputRef.current.value;
    const gpuTypeOptions = getGpuTypeOptions(selectedMachineType, selectedZone);
    const selectedMachineTypeObj = findOptionByValue(getMachineTypeOptions(selectedZone), selectedMachineType);
    this.gpuDataStore = getGpuDataList(selectedMachineTypeObj, gpuTypeOptions);

    this.setState({
      gpuTypeOptions: this.gpuDataStore.map((gpuData: GpuData) => gpuData.type)
    });
  }

  onGpuTypeChange(selectedGpuType: string) {
    const gpuCountOptions = this.gpuDataStore
      .find(
        (data: GpuData) => {
          return data.type.value === selectedGpuType
        })!.counts;

    this.setState({
      shouldShowGpuCount: selectedGpuType !== '',
      gpuCountOptions: gpuCountOptions
    });
  }

  onScheduleTypeChange(selectedScheduleType: string) {
    // Show/hide frequency input based on schedule type
    if (selectedScheduleType === 'single') {
      this.setState({
        shouldShowFrequency: false,
      });
    } else {
      this.setState({
        shouldShowFrequency: true,
      });
    }
  }
}
