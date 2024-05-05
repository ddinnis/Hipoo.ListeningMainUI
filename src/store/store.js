import { defineStore } from "pinia";

export const usebreadcrumbStore = defineStore("counter", {
  state: () => {
    return {
      breadcrumbOne: "",
      idOne: "",
      breadcrumbTwo: "",
      idTwo: "",
      breadcrumbThree: "",
    };
  },
  actions: {
    increment() {
      this.count++;
    },
  },
  persist: true,
});
