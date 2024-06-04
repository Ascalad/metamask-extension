import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addUrlProtocolPrefix } from '../../../../app/scripts/lib/util';

import {
  useSetIsProfileSyncingEnabled,
  useEnableProfileSyncing,
} from '../../../hooks/metamask-notifications/useProfileSyncing';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import {
  COINGECKO_LINK,
  CRYPTOCOMPARE_LINK,
  PRIVACY_POLICY_LINK,
  TRANSACTION_SIMULATIONS_LEARN_MORE_LINK,
} from '../../../../shared/lib/ui-utils';
import Button from '../../../components/ui/button';

import {
  Box,
  PickerNetwork,
  Text,
  TextField,
  ButtonSecondary,
  ButtonSecondarySize,
  Icon,
  IconName,
  IconSize,
} from '../../../components/component-library';
import { MetaMetricsContext } from '../../../contexts/metametrics';
import {
  TextColor,
  TextVariant,
  IconColor,
  Display,
  AlignItems,
  JustifyContent,
  FlexDirection,
  BlockSize,
} from '../../../helpers/constants/design-system';
import { ONBOARDING_COMPLETION_ROUTE } from '../../../helpers/constants/routes';
import { useI18nContext } from '../../../hooks/useI18nContext';
import {
  getAllNetworks,
  getCurrentNetwork,
  getPetnamesEnabled,
  getExternalServicesOnboardingToggleState,
} from '../../../selectors';
import { selectIsProfileSyncingEnabled } from '../../../selectors/metamask-notifications/profile-syncing';
import { selectParticipateInMetaMetrics } from '../../../selectors/metamask-notifications/authentication';
import {
  setCompletedOnboarding,
  setIpfsGateway,
  setUseCurrencyRateCheck,
  setUseMultiAccountBalanceChecker,
  setUsePhishDetect,
  setUse4ByteResolution,
  setUseTokenDetection,
  setUseAddressBarEnsResolution,
  showModal,
  toggleNetworkMenu,
  setIncomingTransactionsPreferences,
  toggleExternalServices,
  setUseTransactionSimulations,
  setPetnamesEnabled,
  performSignIn,
} from '../../../store/actions';
import {
  onboardingToggleBasicFunctionalityOn,
  openBasicFunctionalityModal,
} from '../../../ducks/app/app';
import IncomingTransactionToggle from '../../../components/app/incoming-trasaction-toggle/incoming-transaction-toggle';
import { Setting } from './setting';

export default function PrivacySettings() {
  const t = useI18nContext();
  const dispatch = useDispatch();
  const history = useHistory();

  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hiddenClass, setHiddenClass] = useState(true);
  const { setIsProfileSyncingEnabled, error: setIsProfileSyncingEnabledError } =
    useSetIsProfileSyncingEnabled();
  const { enableProfileSyncing, error: disableProfileSyncingError } =
    useEnableProfileSyncing();

  const profileSyncingError =
    setIsProfileSyncingEnabledError || disableProfileSyncingError;

  const defaultState = useSelector((state) => state.metamask);
  const {
    incomingTransactionsPreferences,
    usePhishDetect,
    use4ByteResolution,
    useTokenDetection,
    useCurrencyRateCheck,
    useMultiAccountBalanceChecker,
    ipfsGateway,
    useAddressBarEnsResolution,
    useTransactionSimulations,
  } = defaultState;
  const petnamesEnabled = useSelector(getPetnamesEnabled);
  const isProfileSyncingEnabled = useSelector(selectIsProfileSyncingEnabled);
  const participateInMetaMetrics = useSelector(selectParticipateInMetaMetrics);

  const [usePhishingDetection, setUsePhishingDetection] =
    useState(usePhishDetect);
  const [turnOn4ByteResolution, setTurnOn4ByteResolution] =
    useState(use4ByteResolution);
  const [turnOnTokenDetection, setTurnOnTokenDetection] =
    useState(useTokenDetection);
  const [turnOnCurrencyRateCheck, setTurnOnCurrencyRateCheck] =
    useState(useCurrencyRateCheck);

  const [
    isMultiAccountBalanceCheckerEnabled,
    setMultiAccountBalanceCheckerEnabled,
  ] = useState(useMultiAccountBalanceChecker);
  const [isTransactionSimulationsEnabled, setTransactionSimulationsEnabled] =
    useState(useTransactionSimulations);
  const [ipfsURL, setIPFSURL] = useState(ipfsGateway);
  const [ipfsError, setIPFSError] = useState(null);
  const [addressBarResolution, setAddressBarResolution] = useState(
    useAddressBarEnsResolution,
  );
  const [turnOnPetnames, setTurnOnPetnames] = useState(petnamesEnabled);

  const trackEvent = useContext(MetaMetricsContext);
  const currentNetwork = useSelector(getCurrentNetwork);
  const allNetworks = useSelector(getAllNetworks);

  const externalServicesOnboardingToggleState = useSelector(
    getExternalServicesOnboardingToggleState,
  );

  const handleSubmit = () => {
    dispatch(toggleExternalServices(externalServicesOnboardingToggleState));
    dispatch(setUsePhishDetect(usePhishingDetection));
    dispatch(setUse4ByteResolution(turnOn4ByteResolution));
    dispatch(setUseTokenDetection(turnOnTokenDetection));
    dispatch(
      setUseMultiAccountBalanceChecker(isMultiAccountBalanceCheckerEnabled),
    );
    dispatch(setUseCurrencyRateCheck(turnOnCurrencyRateCheck));
    dispatch(setCompletedOnboarding());
    dispatch(setUseAddressBarEnsResolution(addressBarResolution));
    setUseTransactionSimulations(isTransactionSimulationsEnabled);
    dispatch(setPetnamesEnabled(turnOnPetnames));

    if (externalServicesOnboardingToggleState) {
      if (!isProfileSyncingEnabled && participateInMetaMetrics) {
        dispatch(performSignIn());
      }
    }

    if (ipfsURL && !ipfsError) {
      const { host } = new URL(addUrlProtocolPrefix(ipfsURL));
      dispatch(setIpfsGateway(host));
    }

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: MetaMetricsEventName.OnboardingWalletAdvancedSettings,
      properties: {
        show_incoming_tx: incomingTransactionsPreferences,
        use_phising_detection: usePhishingDetection,
        turnon_token_detection: turnOnTokenDetection,
      },
    });

    const eventName =
      isProfileSyncingEnabled || participateInMetaMetrics
        ? MetaMetricsEventName.OnboardingWalletAdvancedSettingsWithAuthenticating
        : MetaMetricsEventName.OnboardingWalletAdvancedSettingsWithoutAuthenticating;

    trackEvent({
      category: MetaMetricsEventCategory.Onboarding,
      event: eventName,
      properties: {
        isProfileSyncingEnabled,
        participateInMetaMetrics,
      },
    });

    history.push(ONBOARDING_COMPLETION_ROUTE);
  };

  const handleUseProfileSync = async () => {
    if (isProfileSyncingEnabled) {
      dispatch(
        showModal({
          name: 'CONFIRM_TURN_OFF_PROFILE_SYNCING',
          turnOffProfileSyncing: () => {
            setIsProfileSyncingEnabled(false);
            trackEvent({
              category: MetaMetricsEventCategory.Onboarding,
              event:
                MetaMetricsEventName.OnboardingWalletAdvancedSettingsTurnOffProfileSyncing,
              properties: {
                participateInMetaMetrics,
              },
            });
          },
        }),
      );
    } else {
      await enableProfileSyncing();
    }
  };

  const handleIPFSChange = (url) => {
    setIPFSURL(url);
    try {
      const { host } = new URL(addUrlProtocolPrefix(url));
      if (!host || host === 'gateway.ipfs.io') {
        throw new Error();
      }
      setIPFSError(null);
    } catch (error) {
      setIPFSError(t('onboardingAdvancedPrivacyIPFSInvalid'));
    }
  };

  const handleItemSelected = (item) => {
    setSelectedItem(item);
    setShowDetail(true);

    setTimeout(() => {
      setHiddenClass(false);
    }, 500);
  };

  const handleBack = () => {
    setShowDetail(false);
    setTimeout(() => {
      setHiddenClass(true);
    }, 500);
  };

  const items = [
    { id: 1, title: t('general'), subtitle: t('generalDescription') },
    { id: 2, title: t('assets'), subtitle: t('assetsDescription') },
    { id: 3, title: t('security'), subtitle: t('securityDescription') },
  ];

  return (
    <>
      <div className="privacy-settings" data-testid="privacy-settings">
        <div
          className={`container ${showDetail ? 'show-detail' : 'show-list'}`}
        >
          <div className="list-view">
            <Box
              className="privacy-settings__header"
              marginTop={6}
              marginBottom={6}
              display={Display.Flex}
              flexDirection={FlexDirection.Column}
              justifyContent={JustifyContent.flexStart}
            >
              <Box
                display={Display.Flex}
                alignItems={AlignItems.center}
                flexDirection={FlexDirection.Row}
                justifyContent={JustifyContent.flexStart}
              >
                <Button
                  type="inline"
                  icon={
                    <Icon
                      name={IconName.ArrowLeft}
                      size={IconSize.Lg}
                      color={IconColor.iconDefault}
                    />
                  }
                  data-testid="privacy-settings-back-button"
                  onClick={handleSubmit}
                />
                <Box
                  display={Display.Flex}
                  alignItems={AlignItems.center}
                  justifyContent={JustifyContent.center}
                  width={BlockSize.Full}
                >
                  <Text variant={TextVariant.headingLg} as="h2">
                    {t('defaultSettingsTitle')}
                  </Text>
                </Box>
              </Box>
              <Text variant={TextVariant.bodyLgMedium} marginTop={5}>
                {t('defaultSettingsSubTitle')}
              </Text>
              <a
                href="https://support.metamask.io/privacy-and-security/privacy-best-practices"
                target="_blank"
                rel="noreferrer"
                key="learnMoreAboutPrivacy"
                style={{
                  fontSize: 'var(--font-size-5)',
                }}
              >
                {t('learnMoreAboutPrivacy')}
              </a>
            </Box>
            <Box>
              <Box
                as="ul"
                marginTop={4}
                marginBottom={4}
                style={{ listStyleType: 'none' }}
                className="privacy-settings__categories-list"
              >
                {items.map((item) => (
                  <Box marginTop={5} marginBottom={5} key={item.id}>
                    <Box
                      display={Display.Flex}
                      alignItems={AlignItems.flexStart}
                      justifyContent={JustifyContent.spaceBetween}
                      className="categories-item-header"
                      onClick={() => handleItemSelected(item)}
                      data-testid={`category-item-${item.title}`}
                    >
                      <Text variant={TextVariant.bodyLgMedium}>
                        {item.title}
                      </Text>
                      <Button
                        type="inline"
                        icon={
                          <Icon
                            name={IconName.ArrowRight}
                            color={IconColor.iconDefault}
                          />
                        }
                        onClick={() => handleItemSelected(item)}
                      />
                    </Box>
                    <Text
                      className="description"
                      variant={TextVariant.bodyMd}
                      color={TextColor.textAlternative}
                    >
                      {item.subtitle}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </div>

          <div
            className={`detail-view ${
              !showDetail && hiddenClass ? 'hidden' : ''
            }`}
          >
            <Box
              className="privacy-settings__header"
              marginTop={6}
              marginBottom={5}
              display={Display.Flex}
              flexDirection={FlexDirection.Row}
              justifyContent={JustifyContent.flexStart}
            >
              <Button
                data-testid="category-back-button"
                type="inline"
                icon={
                  <Icon
                    name={IconName.ArrowLeft}
                    size={IconSize.Lg}
                    color={IconColor.iconDefault}
                  />
                }
                onClick={handleBack}
              />
              <Box
                display={Display.Flex}
                alignItems={AlignItems.center}
                justifyContent={JustifyContent.center}
                width={BlockSize.Full}
              >
                <Text variant={TextVariant.headingLg} as="h2">
                  {selectedItem && selectedItem.title}
                </Text>
              </Box>
            </Box>

            <div
              className="privacy-settings__settings"
              data-testid="privacy-settings-settings"
            >
              {selectedItem && selectedItem.id === 1 ? (
                <>
                  <Setting
                    dataTestId="basic-functionality-toggle"
                    value={externalServicesOnboardingToggleState}
                    setValue={(toggledValue) => {
                      if (toggledValue === false) {
                        dispatch(openBasicFunctionalityModal());
                      } else {
                        dispatch(onboardingToggleBasicFunctionalityOn());
                      }
                    }}
                    title={t('basicConfigurationLabel')}
                    description={t('basicConfigurationDescription', [
                      <a
                        href="https://consensys.io/privacy-policy"
                        key="link"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {t('privacyMsg')}
                      </a>,
                    ])}
                  />

                  <Setting
                    dataTestId="profile-sync-toggle"
                    value={isProfileSyncingEnabled}
                    setValue={handleUseProfileSync}
                    title={t('profileSync')}
                    description={t('profileSyncDescription', [
                      <a
                        href="https://consensys.io/privacy-policy/"
                        key="link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t('profileSyncPrivacyLink')}
                      </a>,
                    ])}
                  />
                  {profileSyncingError && (
                    <Box paddingBottom={4}>
                      <Text
                        as="p"
                        color={TextColor.errorDefault}
                        variant={TextVariant.bodySm}
                      >
                        {t('notificationsSettingsBoxError')}
                      </Text>
                    </Box>
                  )}

                  <Setting
                    title={t('onboardingAdvancedPrivacyNetworkTitle')}
                    showToggle={false}
                    description={
                      <>
                        {t('onboardingAdvancedPrivacyNetworkDescription', [
                          <a
                            href="https://consensys.io/privacy-policy/"
                            key="link"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t('privacyMsg')}
                          </a>,
                        ])}

                        <Box paddingTop={2}>
                          {currentNetwork ? (
                            <div className="privacy-settings__network">
                              <>
                                <PickerNetwork
                                  label={currentNetwork?.nickname}
                                  src={currentNetwork?.rpcPrefs?.imageUrl}
                                  onClick={() => dispatch(toggleNetworkMenu())}
                                />
                              </>
                            </div>
                          ) : (
                            <ButtonSecondary
                              size={ButtonSecondarySize.Lg}
                              onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                  showModal({
                                    name: 'ONBOARDING_ADD_NETWORK',
                                  }),
                                );
                              }}
                            >
                              {t('onboardingAdvancedPrivacyNetworkButton')}
                            </ButtonSecondary>
                          )}
                        </Box>
                      </>
                    }
                  />
                </>
              ) : null}
              {selectedItem && selectedItem.id === 2 ? (
                <>
                  <Setting
                    value={turnOnTokenDetection}
                    setValue={setTurnOnTokenDetection}
                    title={t('turnOnTokenDetection')}
                    description={t('useTokenDetectionPrivacyDesc')}
                  />
                  <Setting
                    value={isTransactionSimulationsEnabled}
                    setValue={setTransactionSimulationsEnabled}
                    title={t('simulationsSettingSubHeader')}
                    description={t('simulationsSettingDescription', [
                      <a
                        key="learn_more_link"
                        href={TRANSACTION_SIMULATIONS_LEARN_MORE_LINK}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t('learnMoreUpperCase')}
                      </a>,
                    ])}
                  />
                  <Setting
                    title={t('onboardingAdvancedPrivacyIPFSTitle')}
                    showToggle={false}
                    description={
                      <>
                        {t('onboardingAdvancedPrivacyIPFSDescription')}
                        <Box paddingTop={2}>
                          <TextField
                            value={ipfsURL}
                            style={{ width: '100%' }}
                            inputProps={{ 'data-testid': 'ipfs-input' }}
                            onChange={(e) => {
                              handleIPFSChange(e.target.value);
                            }}
                          />
                          {ipfsURL ? (
                            <Text
                              variant={TextVariant.bodySm}
                              color={
                                ipfsError
                                  ? TextColor.errorDefault
                                  : TextColor.successDefault
                              }
                            >
                              {ipfsError ||
                                t('onboardingAdvancedPrivacyIPFSValid')}
                            </Text>
                          ) : null}
                        </Box>
                      </>
                    }
                  />
                  <IncomingTransactionToggle
                    allNetworks={allNetworks}
                    setIncomingTransactionsPreferences={(chainId, value) =>
                      dispatch(
                        setIncomingTransactionsPreferences(chainId, value),
                      )
                    }
                    incomingTransactionsPreferences={
                      incomingTransactionsPreferences
                    }
                  />
                  <Setting
                    value={turnOnCurrencyRateCheck}
                    setValue={setTurnOnCurrencyRateCheck}
                    title={t('currencyRateCheckToggle')}
                    dataTestId="currency-rate-check-toggle"
                    description={t('currencyRateCheckToggleDescription', [
                      <a
                        key="coingecko_link"
                        href={COINGECKO_LINK}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t('coingecko')}
                      </a>,
                      <a
                        key="cryptocompare_link"
                        href={CRYPTOCOMPARE_LINK}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t('cryptoCompare')}
                      </a>,
                      <a
                        key="privacy_policy_link"
                        href={PRIVACY_POLICY_LINK}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {t('privacyMsg')}
                      </a>,
                    ])}
                  />
                  <Setting
                    value={addressBarResolution}
                    setValue={setAddressBarResolution}
                    title={t('ensDomainsSettingTitle')}
                    description={
                      <>
                        <Text variant={TextVariant.inherit}>
                          {t('ensDomainsSettingDescriptionIntroduction')}
                        </Text>
                        <Box
                          as="ul"
                          marginTop={4}
                          marginBottom={4}
                          paddingInlineStart={4}
                          style={{ listStyleType: 'circle' }}
                        >
                          <Text variant={TextVariant.inherit} as="li">
                            {t('ensDomainsSettingDescriptionPart1')}
                          </Text>
                          <Text variant={TextVariant.inherit} as="li">
                            {t('ensDomainsSettingDescriptionPart2')}
                          </Text>
                        </Box>
                        <Text variant={TextVariant.inherit}>
                          {t('ensDomainsSettingDescriptionOutroduction')}
                        </Text>
                      </>
                    }
                  />
                  <Setting
                    value={isMultiAccountBalanceCheckerEnabled}
                    setValue={setMultiAccountBalanceCheckerEnabled}
                    title={t('useMultiAccountBalanceChecker')}
                    description={t(
                      'useMultiAccountBalanceCheckerSettingDescription',
                    )}
                  />
                </>
              ) : null}
              {selectedItem && selectedItem.id === 3 ? (
                <>
                  <Setting
                    value={usePhishingDetection}
                    setValue={setUsePhishingDetection}
                    title={t('usePhishingDetection')}
                    description={t(
                      'onboardingUsePhishingDetectionDescription',
                      [
                        <a
                          href="https://www.jsdelivr.com"
                          target="_blank"
                          rel="noreferrer"
                          key="jsDeliver"
                        >
                          {t('jsDeliver')}
                        </a>,
                        <a
                          href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-com"
                          target="_blank"
                          rel="noreferrer"
                          key="privacyMsg"
                        >
                          {t('privacyMsg')}
                        </a>,
                      ],
                    )}
                  />
                  <Setting
                    value={turnOn4ByteResolution}
                    setValue={setTurnOn4ByteResolution}
                    title={t('use4ByteResolution')}
                    description={t('use4ByteResolutionDescription')}
                  />
                  <Setting
                    value={turnOnPetnames}
                    setValue={setTurnOnPetnames}
                    title={t('petnamesEnabledToggle')}
                    description={t('petnamesEnabledToggleDescription')}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
