import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  ButtonPrimary,
  ButtonPrimarySize,
  FormTextField,
  FormTextFieldSize,
  HelpText,
  HelpTextSeverity,
} from '../../../component-library';
import {
  BackgroundColor,
  BlockSize,
  BorderRadius,
  Display,
  FlexDirection,
  JustifyContent,
  TextVariant,
} from '../../../../helpers/constants/design-system';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import { isWebUrl } from '../../../../../app/scripts/lib/util';

const AddBlockExplorerModal = ({
  onAdded,
}: {
  onAdded: (url: string) => void;
}) => {
  const t = useI18nContext();
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (url?.length > 0 && !isWebUrl(url)) {
      setError(isWebUrl(`https://${url}`) ? t('urlErrorMsg') : t('invalidRPC')); // todo this says rpc
    } else {
      setError(undefined);
    }
  }, [url]);

  return (
    <Box
      className="networks-tab__scrollable"
      display={Display.Flex}
      flexDirection={FlexDirection.Column}
      justifyContent={JustifyContent.spaceBetween}
      height={BlockSize.Full}
    >
      <Box paddingLeft={4} paddingRight={4}>
        <FormTextField
          size={FormTextFieldSize.Lg}
          textFieldProps={{ borderRadius: BorderRadius.LG }}
          error={Boolean(error)}
          id="additional-rpc-url"
          label={t('blockExplorerUrl')}
          inputProps={{
            variant: TextVariant.bodySm,
          }}
          labelProps={{
            children: undefined,
            variant: TextVariant.bodyMdMedium,
          }}
          onChange={(e) => setUrl(e.target.value)}
        />
        {error && (
          <HelpText severity={HelpTextSeverity.Danger}>{error}</HelpText>
        )}
      </Box>
      <Box
        className="networks-tab__network-form__footer"
        backgroundColor={BackgroundColor.backgroundDefault}
        padding={4}
        width={BlockSize.Full}
      >
        <ButtonPrimary
          width={BlockSize.Full}
          disabled={Boolean(error)}
          size={ButtonPrimarySize.Lg}
          onClick={async () => {
            if (url) {
              onAdded(url);
            }
          }}
        >
          {t('addUrl')}
        </ButtonPrimary>
      </Box>
    </Box>
  );
};

export default AddBlockExplorerModal;
