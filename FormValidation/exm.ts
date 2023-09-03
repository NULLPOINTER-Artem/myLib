<template>
  <div>
    <slot
      name="default"
      :validationResult="validationResult"
      :getFormState="getFormState"
      :getSchema="getSchema"
      :validate="validate"
      :hasError="hasError"
      :getErrorMessage="getErrorMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { deepClone, validateForm, deepMerge } from "@/utils/utils.ts";

const childState = ref<any>(null);
let childStateCopy: any = null;
let schema: any = null;
const validationResult = ref<any>({});

const getFormState = (state: any) => {
  childState.value = state;
  childStateCopy = deepClone(state);
};

const getSchema = (childSchema: any) => {
  schema = childSchema;
};

// watch changes of state and validate
watch(
  childState,
  (newChildState: any) => {
    for (const [key] of Object.entries(newChildState)) {
      if (newChildState[key] !== childStateCopy[key]) {
        if (hasError(key)) {
          delete validationResult.value.errorMessages[key];
        }

        validationResult.value = deepMerge(validationResult.value, validateForm(schema, newChildState, key));
      }
    }

    childStateCopy = deepClone(newChildState);
  },
  { deep: true }
);

// full state validate
const validate = (state: any) => {
  validationResult.value = validateForm(schema, state);
};

const hasError = (key: any) => {
  return validationResult.value.errorMessages && key in validationResult.value.errorMessages;
};

const getErrorMessage = (key: any) => {
  return validationResult.value.errorMessages && validationResult.value.errorMessages[key];
};
</script>

<style lang="scss"></style>


export const validateForm = (schema: any, data: any, validateByKey = null) => {
    let isValid = true;
    const errorMessages: {
      [key: string]: string
    } = {};
  
    if (validateByKey) {
      for (const validateFn of schema[validateByKey]) {
        const result = validateFn(data[validateByKey]);
  
        if (typeof result === 'boolean' && result) {
          continue;
        } else {
          isValid = false;
          errorMessages[validateByKey] = result;
          break;
        }
      }
    } else {
      for (const [key, value] of Object.entries(schema)) {
        if (key in schema && key in data) {
          for (const fn of value) {
            const result = fn(data[key]);
  
            if (typeof result === 'boolean' && result) {
              continue;
            } else {
              isValid = false;
              errorMessages[key] = result;
              break;
            }
          }
        }
      }
    }
  
    return {
      isValid,
      errorMessages
    }
  };

  const WEBSITE_REGEX = /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
const EMAIL_REGEX = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const PASSWORD_REGEX = /^(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/g;
const PHONE_REGEX = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

export const formRules = {
  required: (params = {}) => {
    return (value: any) => !!value || { translate: 'formRules.required', params }
  },
  email: (params = {}) => {
    return (value: any) => EMAIL_REGEX.test(value) || { translate: 'formRules.email', params }
  },
  website: (params = {}) => {
    return (value: any) => WEBSITE_REGEX.test(value) || { translate: 'formRules.website', params }
  },
  minLength: (params = {}) => {
    return (value: any) => (value && params.length && value.length >= params.length) || { translate: 'formRules.minLength', params }
  },
  maxLength: (params = {}) => {
    return (value: any) => (value && params.length && value.length <= params.length) || { translate: 'formRules.maxLength', params }
  },
  password: (params = {}) => {
    return (value: any) => PASSWORD_REGEX.test(value) || { translate: 'formRules.password', params }
  },
  phone: (params = {}) => {
    return (value: any) => PHONE_REGEX.test(value) || { translate: 'formRules.phone', params }
  },
  fullName: (params = {}) => {
    return (value: any) => (value && value.includes(' ')) || { translate: 'formRules.fullName', params }
  },
};


<template>
  <form name="make-call-form" @submit.prevent.stop="onSubmit">
    <div class="d-flex justify-content-center">
      <div class="col-6 pl-0 pr-7 pr-mdl-2">
        <div class="contact-modal__contact-form__input mb-8 mb-xs-6">
          <FormField
            property-name="fullName"
            :label="'Name'"
            :for-attr="'mcf_full-name'"
            class-label="mb-3 mb-xs-2"
            :has-error="props.hasError"
            :get-error-message="props.getErrorMessage"
          >
            <input
              v-model="formState.fullName"
              type="text"
              id="mcf_full-name"
              placeholder="Enter your full name"
              :class="['px-0', { error: props.hasError && props.hasError('fullName') }]"
            />
          </FormField>
        </div>
      </div>

      <div class="col-6 pl-8 pl-mdl-2 pr-0">
        <div class="contact-modal__contact-form__input mb-12 mb-xs-6">
          <!-- here put the phoneNumber -->
          <PhoneInput
            v-model="formState.phone"
            property-name="phone"
            :label="'Phone number'"
            :for-attr="'mcf_phone'"
            class-label="mb-3 mb-xs-2"
            :has-error="props.hasError"
            :get-error-message="props.getErrorMessage"
          />
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center mb-8 mb-xs-6">
      <div class="col-6 pl-0 pr-7 pr-mdl-2">
        <!-- here put the Calendar -->
        <div class="contact-modal__contact-form__input input-icon">
          <svg>
            <use href="#icon-input-calendar" />
          </svg>
          <label for="mcf_call-data" class="mb-3 mb-xs-2">Call's data</label>
          <input type="text" id="mcf_call-data" placeholder="24.07.2023" disabled class="px-0" />
        </div>
      </div>

      <div class="col-6 pl-8 pl-mdl-2 pr-0">
        <!-- here put the Calendar -->
        <div class="contact-modal__contact-form__input input-icon">
          <svg>
            <use href="#icon-input-clock" />
          </svg>
          <label for="mcf_call-time" class="mb-3 mb-xs-2">Call's time</label>
          <input type="text" id="mcf_call-time" placeholder="10:10" disabled class="px-0" />
        </div>
      </div>
    </div>

    <div class="contact-modal__contact-form__textarea">
      <FormField
        property-name="message"
        :label="'Message'"
        :for-attr="'mcf_message'"
        class-label="mb-3 mb-xs-2"
        :has-error="props.hasError"
        :get-error-message="props.getErrorMessage"
      >
        <textarea
          v-model="formState.message"
          id="mcf_message"
          placeholder="Write your message"
          :class="['', { error: props.hasError && props.hasError('message') }]"
        />
      </FormField>
    </div>

    <div class="contact-modal__contact-form__send-btn mt-16 mt-mdl-10 mt-xs-4">
      <button type="submit" class="standard-btn px-22 px-sm-6 py-4 py-sm-2 py-xs-3">
        <svg>
          <use href="#icon-luce-star" />
        </svg>
        Assign a call
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { formRules } from "@/utils/formRules.ts";
import FormField from "./FormField.vue";
import PhoneInput from "./PhoneInput.vue";

interface IAssignCallProps {
  getFormState?: Function;
  validate?: Function;
  getSchema?: Function;
  validationResult?: any;
  hasError: Function;
  getErrorMessage: Function;
}
const props = defineProps<IAssignCallProps>();

interface IFormState {
  fullName: string;
  message: string;
  phone: string;
}
const formState = reactive<IFormState>({
  fullName: "",
  message: "",
  phone: "",
});
const formSchema = {
  fullName: [formRules.required(), formRules.fullName()],
  message: [formRules.required(), formRules.maxLength({ length: 250 })],
  phone: [formRules.required(), formRules.phone()],
};

onMounted(() => {
  if (props.getFormState) {
    props.getFormState(formState);
  }

  if (props.getSchema) {
    props.getSchema(formSchema);
  }
});

const onSubmit = () => {
  props.validate && props.validate(formState);

  console.log("formState");
  console.dir(formState);

  if (props.validationResult.isValid) {
    // TODO: API request
  }
};
</script>

<style lang="scss" scoped>
.error {
  border-color: red;
}
</style>


<FormValidate>
    <template
        v-slot:default="{
        getFormState,
        validate,
        getSchema,
        validationResult,
        hasError,
        getErrorMessage,
        }"
    >
        <AssignCall
        :getFormState="getFormState"
        :validate="validate"
        :getSchema="getSchema"
        :validationResult="validationResult"
        :hasError="hasError"
        :getErrorMessage="getErrorMessage"
        />
    </template>
</FormValidate>