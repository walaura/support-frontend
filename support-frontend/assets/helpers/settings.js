// @flow

import { type AmountsRegions, type ContributionTypes } from 'helpers/contributions';
import { type Option } from 'helpers/types/option';

export type Status = 'On' | 'Off';

export type SwitchObject = {
  [string]: Status,
};

export type Switches = {
  [string]: SwitchObject,
  experiments: {
    [string]: {
      name: string,
      description: string,
      state: Status,
    }
  }
};

export type Settings = {
  switches: Switches,
  amounts: AmountsRegions,
  contributionTypes: ContributionTypes,
  metricUrl: string,
  useDigitalVoucher: Option<boolean>,
};
