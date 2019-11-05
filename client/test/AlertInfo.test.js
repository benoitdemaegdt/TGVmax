import { mount, shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import AlertInfo from '../src/components/AlertInfo.vue';
import vuetify from 'vuetify';

describe('AlertInfo', () => {
  beforeAll(() => {
    Vue.use(vuetify);
  });

  it('should display "prochainement" when lastCheck is undefined', () => {
    /**
     * mount component without field 'lastCheck'
     */
    const wrapper = shallowMount(AlertInfo, {
      propsData: {
        alert: {
          _id: 1,
          fromTime: new Date(),
          toTime: new Date(),
          tgvmaxNumber: 'HC000054321',
          status: 'inprogress'
        }
      }
    });
    expect(wrapper.find('.lastCheck').exists()).toBe(true);
    expect(wrapper.find('.lastCheck').text()).toBe('Prochainement');
    expect(wrapper.find('.cardTitle').text()).toBe('Information');
  });

  it('should display the actual date when lastCheck is defined (summer time)', () => {
    /**
     * mount component with field 'lastCheck'
     */
    const wrapper = shallowMount(AlertInfo, {
      propsData: {
        alert: {
          _id: 1,
          fromTime: new Date(),
          toTime: new Date(),
          tgvmaxNumber: 'HC000054321',
          status: 'inprogress',
          lastCheck: '2019-08-29T12:18:45.549+00:00'
        }
      }
    });
    expect(wrapper.find('.lastCheck').exists()).toBe(true);
    expect(wrapper.find('.lastCheck').text()).toBe('jeudi 29 août à 14:18');
  });

  it('should display the actual date when lastCheck is defined (winter time)', () => {
    /**
     * mount component with field 'lastCheck'
     */
    const wrapper = shallowMount(AlertInfo, {
      propsData: {
        alert: {
          _id: 1,
          fromTime: new Date(),
          toTime: new Date(),
          tgvmaxNumber: 'HC000054321',
          status: 'inprogress',
          lastCheck: '2019-10-29T12:18:45.549+00:00'
        }
      }
    });
    expect(wrapper.find('.lastCheck').exists()).toBe(true);
    expect(wrapper.find('.lastCheck').text()).toBe('mardi 29 octobre à 13:18');
  });

  it('should fire event "emit:close" after clicking button', () => {
    /**
     * use mount instead of shallowMount here
     * because testing event emit
     */
    const wrapper = mount(AlertInfo, {
      propsData: {
        alert: {
          _id: 1,
          fromTime: new Date(),
          toTime: new Date(),
          tgvmaxNumber: 'HC000054321',
          status: 'inprogress',
          lastCheck: '2019-10-29T12:18:45.549+00:00'
        }
      }
    });

    expect(wrapper.find('.closeBtn').text()).toBe('Fermer');
    expect(wrapper.emitted()).toEqual({});
    /**
     * click button and check event emit
     */
    wrapper.find('.closeBtn').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('close:dialog');
  });
});
