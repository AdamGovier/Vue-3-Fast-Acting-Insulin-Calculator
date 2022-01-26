import { createRouter, createWebHistory } from 'vue-router'

import Calculator from '../views/Calculator.vue';
import Menu from '../views/Menu.vue';
import Welcome from '../views/Welcome.vue';
import Diary from '../views/Diary.vue';

// Settings
import SettingsMenu from '../views/SettingsMenu.vue';
import CorrectionSettings from '../views/SubMenu_Settings/CorrectionSettings.vue';
import DoseSettings from '../views/SubMenu_Settings/DoseSettings.vue';
import Modifiers from '../views/SubMenu_Settings/Modifiers.vue';

// Support
import SupportMenu from '../views/SupportMenu.vue';
import Legal from '../views/SubMenu_Support/Legal.vue';

const routes = [
  {
    path: "/",
    component: Calculator
  },

  {
    path: "/Menu",
    component: Menu
  },

  {
    path: '/Welcome',
    component: Welcome
  },

  {
    path: "/Diary",
    component: Diary
  },

  // Settings menu and children.

  {
    path: "/settings",
    component: SettingsMenu,
  },
  {
    path: "/settings/CorrectionSettings",
    component: CorrectionSettings
  },
  {
    path: "/settings/DoseSettings",
    component: DoseSettings
  },
  {
    path: "/settings/Modifiers",
    component: Modifiers
  },

  // End of settings menu and children.

  // Support menu and children.

  {
    path: "/Support",
    component: SupportMenu
  },
  {
    path: "/support/Legal",
    component: Legal
  }

  // End of support menu and children.

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
