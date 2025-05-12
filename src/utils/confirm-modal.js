import Vue from "vue";
import Vuetify from "vuetify";
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VProgressCircular,
  VDivider,
} from "vuetify/lib/components";

Vue.use(Vuetify);
const vuetify = new Vuetify();

export function confirmModal() {
  return {
    confirm(options = {}) {
      return new Promise((resolve) => {
        const container = document.createElement("div");
        document.body.appendChild(container);

        // Параметры по умолчанию
        const dialogOptions = {
          title: "Подтверждение",
          text: "Вы уверены?",
          confirmText: "Да",
          cancelText: "Отмена",
          confirmColor: "primary",
          cancelColor: "grey",
          width: 400,
          persistent: false,
          loading: false,
          customContent: null,
          ...options,
        };

        const ConfirmComponent = Vue.extend({
          components: {
            VDialog,
            VCard,
            VCardTitle,
            VCardText,
            VCardActions,
            VBtn,
            VProgressCircular,
            VDivider,
          },
          data() {
            return {
              isOpen: true,
              title: dialogOptions.title,
              text: dialogOptions.text,
              confirmText: dialogOptions.confirmText,
              cancelText: dialogOptions.cancelText,
              confirmColor: dialogOptions.confirmColor,
              cancelColor: dialogOptions.cancelColor,
              width: dialogOptions.width,
              persistent: dialogOptions.persistent,
              loading: dialogOptions.loading,
              customContent: dialogOptions.customContent,
              isConfirming: false,
            };
          },
          methods: {
            async confirmAction() {
              this.isConfirming = true;

              // Опциональная задержка для имитации загрузки
              if (dialogOptions.loading) {
                await new Promise((resolveTimeout) => {
                  setTimeout(resolveTimeout, 500);
                });
              }

              this.isOpen = false;
              resolve(true);
            },
            cancelAction() {
              this.isOpen = false;
              resolve(false);
            },
            afterLeave() {
              this.$destroy();
              container.remove();
            },
          },
          render(h) {
            // Создаем содержимое диалогового окна
            const cardChildren = [
              h("v-card-title", this.title),
              this.text ? h("v-card-text", this.text) : null,
            ];

            // Добавляем кастомный контент, если он есть
            if (this.customContent) {
              if (this.text) {
                cardChildren.push(h("v-divider"));
              }
              cardChildren.push(
                h("div", { domProps: { innerHTML: this.customContent } })
              );
            }

            // Добавляем кнопки действий
            cardChildren.push(
              h("v-card-actions", { class: "justify-end" }, [
                this.cancelText
                  ? h(
                      "v-btn",
                      {
                        props: {
                          text: true,
                          color: this.cancelColor,
                          disabled: this.isConfirming,
                        },
                        on: { click: this.cancelAction },
                      },
                      this.cancelText
                    )
                  : null,
                h(
                  "v-btn",
                  {
                    props: {
                      color: this.confirmColor,
                      loading: this.isConfirming,
                    },
                    on: { click: this.confirmAction },
                  },
                  this.isConfirming ? [] : [this.confirmText]
                ),
              ])
            );

            // Создаем карточку
            const card = h("v-card", {}, cardChildren.filter(Boolean));

            // Создаем диалоговое окно
            return h(
              "v-dialog",
              {
                props: {
                  value: this.isOpen,
                  width: this.width,
                  persistent: this.persistent || this.isConfirming,
                },
                on: {
                  "after-leave": this.afterLeave,
                },
              },
              [card]
            );
          },
        });

        new ConfirmComponent({
          vuetify,
        }).$mount(container);
      });
    },
  };
}
