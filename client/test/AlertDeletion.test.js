import { mount } from '@vue/test-utils';
import Vue from 'vue';
import Vuex from 'vuex';
import AlertDeletion from '../src/components/AlertDeletion.vue';
import vuetify from 'vuetify';

describe('AlertDeletion', () => {
  let actions;
  let store;

  beforeAll(() => {
    Vue.use(vuetify);
    Vue.use(Vuex);
    /**
     * mock vuex
     */
    actions = {
      deleteAlert: jest.fn()
    };
    store = new Vuex.Store({
      actions
    });
  });

  it('should emit vuex action "deleteAlert" after click on "supprimer"', async () => {
    /**
     * mount component AlertDeletion
     */
    const wrapper = mount(AlertDeletion, { store });
    expect(wrapper.find('.cardTitle').exists()).toBe(true);
    expect(wrapper.find('.cardTitle').text()).toBe('Suppression');
    expect(wrapper.find('.cardText').text()).toBe(
      'Êtes-vous sûr de vouloir supprimer cette alerte ?'
    );
    /**
     * click button and check event emit
     */
    expect(wrapper.emitted()).toEqual({});
    wrapper.find('.deleteBtn').trigger('click');
    expect(actions.deleteAlert).toHaveBeenCalled();
  });

  it('should emit event "close:dialog" after click on "annuler"', () => {
    /**
     * mount component AlertDeletion
     */
    const wrapper = mount(AlertDeletion);
    /**
     * click button and check event emit
     */
    expect(wrapper.emitted()).toEqual({});
    wrapper.find('.closeBtn').trigger('click');
    expect(wrapper.emitted()).not.toHaveProperty('delete:travelAlert');
    expect(wrapper.emitted()).toHaveProperty('close:dialog');
  });
});
