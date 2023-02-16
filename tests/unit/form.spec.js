import { shallowMount, mount } from '@vue/test-utils'
import ElementUI from 'element-ui';
import Vue from "vue";
import Form from '@/components/Form.vue'
Vue.use(ElementUI)
describe('Form.vue', () => {
  it('验证props', async () => {
    // 不会深层次的渲染组件
    const wrapper = shallowMount(Form, {
      propsData: {
        label: '名称'
      }
    })
    // 验证传入的是label是名称
    expect(wrapper
      .findComponent('el-form-item-stub')
      .attributes('label')
    ).toBe('名称')


    // 这里需要同步
    await wrapper.setProps({
      label: '姓名',
      btnText: '确定'
    })
    // 验证第一个form-item的label是姓名
    expect(wrapper
      .findAllComponents('el-form-item-stub')
      .at(0)
      .attributes('label')
    )

      .toBe('姓名')
    // 验证第一个按钮的文字是确定
    expect(wrapper
      .findComponent('el-button-stub')
      .text()
    )
      .toBe('确定')

  })


  it('输入input', async () => {
    // 深层次的渲染组件,一直渲染到html标签
    const wrapper = mount(Form, {
      propsData: {
        label: '测试名称',
        brnText: '确认'
      }
    })

    // 手动设置值同步到input的value上
    await wrapper.setData({
      ruleForm: {
        name: '李四'
      }
    })
    expect(wrapper.vm.$el.querySelector('input').value).toBe('李四')

    // 因为element-ui 组件内部监听了input的改变，然后改变了form组件的ruleForm.name值
    wrapper.find('.el-input__inner').setValue('张三')

    wrapper.vm.$nextTick(() => {
      // 验证data的值 是 张三
      expect(wrapper.vm.ruleForm.name).toBe('张三')
    })
  })

  it('select', async () => {
    // 深层次的渲染组件,一直渲染到html标签
    const wrapper = mount(Form, {
      attachTo: document.body
    })
    // 默认没有显示 el-select-dropdown
    expect(wrapper.find('.el-select-dropdown').isVisible()).toBeFalsy()

    await wrapper.find('.el-select input').trigger('click')
    // 因为 select 的弹出框默认挂在body上，所以从body 里面获取
    expect(document.body.querySelector('.el-select-dropdown')).toBeTruthy();


    Array.from(document.body.querySelector('.el-select-dropdown')
      .querySelectorAll('.el-select-dropdown__item')
    )
      // 获取‘区域二’
      .at(1)
      // 手动触发原生click事件
      .dispatchEvent(new Event('click'))


    expect(wrapper.vm.ruleForm.region).toBe('beijing')
  })


  it('validate', async () => {
    const wrapper = shallowMount(Form);

    const tempSubmitForm = wrapper.vm.submitForm

    //方案一：  先 mock 内部的方法，如果要测试内部逻辑不建议此方法
    const submitForm = jest.fn();
    wrapper.vm.submitForm = submitForm;
    // 触发click 事件
    wrapper.findAllComponents('el-button-stub')
      .at(0).vm.$emit('click');
    // 断言mock的方法被触发
    expect(wrapper.vm.submitForm).toBeCalled()
    expect(submitForm.mock.calls[0][0]).toBe('ruleForm')

    //方案二：因为向外部发射了 validate 事件,可以mock emit 的 validate 来测试
    wrapper.vm.submitForm = tempSubmitForm;

    // 注意：方法内部调用了组件内的方法，只能模拟this.$refs[formName].validate，或者深度渲染

    // 模拟:
    wrapper.vm.$refs.ruleForm = {
      validate: (cb) => {
        const res =  cb(false)
        expect(res).toBe(false)
      }
    }
    // 触发click 事件
    wrapper.findAllComponents('el-button-stub')
      .at(0).vm.$emit('click');
    expect(wrapper.emitted('validate')[0]).toEqual([false])
  })
})
