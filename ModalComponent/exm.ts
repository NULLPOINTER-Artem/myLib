<template>
  <div :class="['popup-overlay', { 'popup-overlay-active': props.isOpen }]">
    <div ref="popup" :class="['popup', props.classes, { 'popup-opened': props.isOpen }]" :style="popupInlineStyle">
      <slot name="default" :currentStep="currentStep" :changeStep="onChangeStep" :close="onClose" />
    </div>
  </div>
</template>

<script setup lang="ts">
// popup-step + active
const emit = defineEmits(["close"]);

interface IModalComponentProps {
  classes?: string;
  isOpen: boolean;
}
const props = defineProps<IModalComponentProps>();

const popup = ref<HTMLDivElement>();
const popupInlineStyle = reactive<any>({});
const popupStepsLength = ref<number>();

const currentStep = ref<number>(1);
const onChangeStep = (step: number) => {
  currentStep.value = currentStep.value + +step;

  if (window.innerWidth > 800) {
    popupInlineStyle.left = `${(currentStep.value - 1) * -100}vw`;
  } else {
    popupInlineStyle.left = `${(currentStep.value - 1) * -175}vw`;
  }
};

onMounted(() => {
  // Next Tick
  setTimeout(() => {
    if (popup.value) {
      popupStepsLength.value = popup.value.getElementsByClassName("popup-step").length;
    }
  }, 0);
});

watch(
  () => props.isOpen,
  (isOpen: boolean) => {
    if (isOpen && popup.value) {
      popupStepsLength.value = popup.value.getElementsByClassName("popup-step").length;

      if (window.innerWidth > 800) {
        popupInlineStyle.width = `${100 * +popupStepsLength.value}vw`;
      } else {
        popupInlineStyle.width = `${150 * +popupStepsLength.value}vw`;
      }

      popupInlineStyle.left = "0";
      popupInlineStyle.top = "0";
    }
  }
);

const onClose = () => {
  popupInlineStyle.top = "100vh";
  popupInlineStyle.opacity = "0";

  setTimeout(() => {
    emit("close");

    setTimeout(() => {
      popupInlineStyle.top = "0";
      popupInlineStyle.left = "100vw";
      popupInlineStyle.opacity = "1";

      currentStep.value = 1;
    }, 600);
  }, 500);
};
</script>

<style lang="scss"></style>


<template>
  <div>
    <div :class="['popup-step', { active: props.currentStep && props.currentStep === 1 }]">
      <div class="contact-modal">
        <div class="popup-close-btn" @click.stop="onClose">
          <svg>
            <use href="#icon-close-modal" />
          </svg>
        </div>

        <div class="container pt-15 px-15 pb-20 p-lg-7">
          <div class="row">
            <div class="col-12 contact-modal__head p-0">
              <div
                class="contact-modal__heading-photo"
                :style="{
                  backgroundImage: `url(${BgImgManager})`,
                }"
              ></div>

              <div class="d-flex flex-column">
                <div class="contact-modal__heading-small">Write a message to</div>
                <div class="contact-modal__heading">Anna</div>
              </div>
            </div>

            <div class="contact-modal__contact-form mt-13 mt-lg-8">
              <FormValidate>
                <template
                  v-slot:default="{ getFormState, validate, getSchema, validationResult, hasError, getErrorMessage }"
                >
                  <AssignCall
                    :getFormState="getFormState"
                    :validate="validate"
                    :getSchema="getSchema"
                    :validationResult="validationResult"
                    :hasError="hasError"
                    :getErrorMessage="getErrorMessage"
                  />

                  <div class="d-flex justify-content-center">
                    <div class="contact-modal__contact-form__terms mt-5">
                      By filling out the form, you accept the
                      <NuxtLink :to="localePath('/terms-regulation')">terms of the regulation</NuxtLink> on the
                      processing and protection of personal data
                    </div>
                  </div>
                </template>
              </FormValidate>

              <div class="contact-modal__messenger mt-13 py-5">
                <div class="contact-modal__messenger__text">Or make a fast call right now via messanger</div>

                <div class="contact-modal__messenger__list mt-4">
                  <div class="contact-modal__messenger__item">Telegram</div>

                  <div class="contact-modal__messenger__item">Viber</div>

                  <div class="contact-modal__messenger__item">WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BgImgManager from "~/assets/images/manager-2.jpg";
import FormValidate from "@/components/Forms/FormValidate.vue";
import AssignCall from "@/components/Forms/AssignCall.vue";

const emit = defineEmits(["close", "changeStep"]);

interface IMakeCallProps {
  currentStep?: number;
}
const props = defineProps<IMakeCallProps>();
const localePath = useLocalePath();

const onClose = () => {
  emit("close");
};
</script>

<style lang="scss"></style>

const isOpenWishList = ref(false);
const onOpenWishList = () => {
  isOpenWishList.value = true;
};

<ModalComponent :isOpen="isOpenWishList" @close="isOpenWishList = false">
    <template v-slot:default="{ currentStep, changeStep, close }">
        <WishList :currentStep="currentStep" @changeStep="changeStep" @close="close" />
    </template>
</ModalComponent>

// CSS
.popup-overlay {
    height: 100vh;
    width: 100vw;
  
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
  
    visibility: hidden;
  
    background: rgba(black, 0);
  
    transition: all 1s ease;
  }
  
  .popup-overlay-active {
    visibility: visible;
    opacity: 1;
  
    background: rgba(black, .5);
  
    //transition: all 2s ease;
  }
  
  .popup {
    //display: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
    visibility: hidden;
  
    height: 100%;
    width: 100%;
  
    position: fixed;
    top: 0;
    left: 200vw;
  
    z-index: 10;
  
    transition: all 2s ease;
  }
  
  .popup-close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
  
    z-index: 10;
  
    cursor: pointer;
  
    svg {
      height: 30px;
      width: 30px;
    }
  }
  
  .popup-opened {
    display: flex !important;
    left: 0;
    visibility: visible;
  
    transition: all 2s ease;
    .popup-step {
      visibility: visible;
    }
  }
  
  .popup-step {
    width: 100vw;
    height: 100%;
    visibility: hidden;
  
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  @include media-query('lg') {
    .popup-close-btn {
      top: 20px;
      right: 20px;
    }
  
    .popup {
      justify-content: space-between;
    }
  }
  
  @keyframes slide-left {
    from {
      left: 0;
      display: flex;
      opacity: 1;
    }
  
    50% {
      left: -50%;
      display: flex;
      opacity: 0.7;
    }
  
    100% {
      left: -100%;
      display: none;
      opacity: 0;
    }
  }
  
  @keyframes slide-right {
    from {
      left: 0;
      display: flex;
      opacity: 1;
    }
  
    50% {
      left: 50%;
      display: flex;
      opacity: 0.7;
    }
  
    100% {
      left: 100%;
      display: none;
      opacity: 0;
    }
  }
  
  