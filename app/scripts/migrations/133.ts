import { hasProperty, isObject } from '@metamask/utils';
import { cloneDeep } from 'lodash';
import type { SmartTransaction } from '@metamask/smart-transactions-controller/dist/types';

export type VersionedData = {
  meta: {
    version: number;
  };
  data: {
    PreferencesController?: {
      smartTransactionsOptInStatus?: boolean | null;
    };
    SmartTransactionsController?: {
      smartTransactionsState: {
        smartTransactions: Record<string, SmartTransaction[]>;
      };
    };
  };
};

const version = 133;

function transformState(state: VersionedData['data']) {
  if (
    !hasProperty(state, 'PreferencesController') ||
    !isObject(state.PreferencesController)
  ) {
    global.sentry?.captureException?.(
      new Error(
        `Invalid PreferencesController state: ${typeof state.PreferencesController}`,
      ),
    );
    return state;
  }

  const { PreferencesController } = state;
  const currentOptInStatus =
    PreferencesController?.smartTransactionsOptInStatus;

  if (currentOptInStatus === undefined || currentOptInStatus === null) {
    PreferencesController.smartTransactionsOptInStatus = true;
  } else if (
    currentOptInStatus === false &&
    !hasExistingSmartTransactions(state)
  ) {
    PreferencesController.smartTransactionsOptInStatus = true;
  }

  return state;
}

function hasExistingSmartTransactions(state: VersionedData['data']): boolean {
  if (
    !hasProperty(state, 'SmartTransactionsController') ||
    !isObject(
      state.SmartTransactionsController?.smartTransactionsState
        ?.smartTransactions,
    )
  ) {
    return false;
  }

  const { smartTransactions } =
    state.SmartTransactionsController.smartTransactionsState;

  return Object.values(smartTransactions).some(
    (chainSmartTransactions: SmartTransaction[]) =>
      chainSmartTransactions.length > 0,
  );
}

const migration = {
  version,
  async migrate(originalVersionedData: VersionedData): Promise<VersionedData> {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    versionedData.data = transformState(versionedData.data);
    return versionedData;
  },
};

export default migration;
