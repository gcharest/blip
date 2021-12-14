import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import omitBy from 'lodash/omitBy'
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { Box, BoxProps } from 'rebass/styled-components';

import * as actions from '../../redux/actions';
import TextInput from '../../components/elements/TextInput';
import { getCommonFormikFieldProps } from '../../core/forms';
import { dateRegex, patientSchema as validationSchema } from '../../core/clinicUtils';
import { Body1 } from '../../components/elements/FontStyles';

export const PatientForm = (props) => {
  const { t, api, onFormChange, patient, ...boxProps } = props;
  const dispatch = useDispatch();
  const selectedClinicId = useSelector((state) => state.blip.selectedClinicId);
  const dateInputFormat = 'MM/DD/YYYY';
  const dateMaskFormat = dateInputFormat.replace(/[A-Z]/g, '9');

  const formikContext = useFormik({
    initialValues: getFormValues(patient),
    onSubmit: values => {
      const action = patient?.id ? {
        handler: 'updateClinicPatient',
        args: [selectedClinicId, patient.id, omitBy({ ...patient, ...getFormValues(values) }, isEmpty)],
      } : {
        handler: 'createClinicCustodialAccount',
        args: [selectedClinicId, { ...omitBy(values, isEmpty) }],
      };

      dispatch(actions.async[action.handler](api, ...action.args));
    },
    validationSchema,
  });

  const {
    values,
    setValues,
  } = formikContext;

  function getFormValues(source) {
    return {
      birthDate: get(source, 'birthDate', ''),
      email: get(source, 'email', ''),
      fullName: get(source, 'fullName', ''),
      mrn: get(source, 'mrn', ''),
    };
  }

  useEffect(() => {
    setValues(getFormValues(patient));
  }, [patient]);

  useEffect(() => {
    onFormChange(formikContext);
  }, [values]);

  return (
    <Box
      as="form"
      id="clinic-patient-form"
    >
      <Box mb={4}>
        <TextInput
          {...getCommonFormikFieldProps('fullName', formikContext)}
          label={t('Full Name')}
          placeholder={t('Full Name')}
          variant="condensed"
          width="100%"
        />
      </Box>

      <Box mb={4}>
        <InputMask
          mask={dateMaskFormat}
          maskPlaceholder={dateInputFormat.toLowerCase()}
          {...getCommonFormikFieldProps('birthDate', formikContext)}
          value={get(values, 'birthDate', '').replace(dateRegex, '$2/$3/$1')}
          onChange={e => {
            formikContext.setFieldValue('birthDate', e.target.value.replace(dateRegex, '$3-$1-$2'), e.target.value.length === 10);
          }}
          onBlur={e => {
            formikContext.setFieldTouched('birthDate');
            formikContext.setFieldValue('birthDate', e.target.value.replace(dateRegex, '$3-$1-$2'));
          }}
        >
          <TextInput
            name="birthDate"
            label={t('Birthdate')}
            placeholder={dateInputFormat.toLowerCase()}
            variant="condensed"
            width="100%"
          />
        </InputMask>
      </Box>

      <Box mb={4}>
        <TextInput
          {...getCommonFormikFieldProps('mrn', formikContext)}
          label={t('MRN (optional)')}
          placeholder={t('MRN')}
          variant="condensed"
          width="100%"
        />
      </Box>

      <Box mb={4}>
        <TextInput
          {...getCommonFormikFieldProps('email', formikContext)}
          label={t('Email (optional)')}
          placeholder={t('Email')}
          variant="condensed"
          width="100%"
        />
      </Box>

      <Body1>
        {t('If you want your patients to upload their data from home, you must include their email address.')}
      </Body1>
    </Box>
  );
};

PatientForm.propTypes = {
  ...BoxProps,
  api: PropTypes.object.isRequired,
  onFormChange: PropTypes.func.isRequired,
  patient: PropTypes.object,
  t: PropTypes.func.isRequired,
};

export default translate()(PatientForm);