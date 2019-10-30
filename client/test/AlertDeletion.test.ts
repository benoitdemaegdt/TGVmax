import { mount } from '@vue/test-utils';
import Vue from 'vue';
import AlertDeletion from '../src/components/AlertDeletion.vue';
import vuetify from 'vuetify';

describe('AlertDeletion', () => {

  beforeAll(() => {
    Vue.use(vuetify);
  });

  it('should emit event "delete:travelAlert" after click on "supprimer"', () => {
    /**
     * mount component AlertDeletion
     */
    const wrapper = mount(AlertDeletion);
    expect(wrapper.find('.cardTitle').exists()).toBe(true);
    expect(wrapper.find('.cardTitle').text()).toBe('Suppression');
    expect(wrapper.find('.cardText').text()).toBe('Êtes-vous sûr de vouloir supprimer cette alerte ?');
    /**
     * click button and check event emit
     */
    expect(wrapper.emitted()).toEqual({});
    wrapper.find('.deleteBtn').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('delete:travelAlert');
    expect(wrapper.emitted()).toHaveProperty('close:dialog');
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
