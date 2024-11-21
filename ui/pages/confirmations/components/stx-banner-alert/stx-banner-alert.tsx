import React from 'react';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  BannerAlert,
  ButtonLink,
  Text,
  BannerAlertSeverity,
} from '../../../../components/component-library';
import { stxAlertIsOpen, dismissSTXMigrationAlert } from '../../../../ducks/alerts/stx-migration';
import ZENDESK_URLS from '../../../../helpers/constants/zendesk-url';

const STXBannerAlert = () => {
  const dispatch = useDispatch();
  const shouldShow = useSelector(stxAlertIsOpen);
  const t = useI18nContext();

  if (!shouldShow) {
    return null;
  }

  return (
    <BannerAlert
      severity={BannerAlertSeverity.Info}
      onClose={() => dispatch(dismissSTXMigrationAlert())}
      data-testid="stx-banner-alert"
    >
      <Text as="p">
        {t('smartTransactionsEnabledMessage')}
        <ButtonLink
          href={ZENDESK_URLS.SMART_TRANSACTIONS_LEARN_MORE}
          onClick={() => dispatch(dismissSTXMigrationAlert())}
          externalLink
        >
          {t('smartTransactionsLearnMore')}
        </ButtonLink>
      </Text>
    </BannerAlert>
  );
};

export default STXBannerAlert;
