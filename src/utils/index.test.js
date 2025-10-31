/**
 * @jest-environment jsdom
 */
import * as utils from './index'
import { describe, it, expect, jest, beforeEach, beforeAll, afterAll, afterEach } from '@jest/globals'

describe('utils-parseParams方法', () => {
  /**
   * @jest-environment-options {"url": "https://jestjs.io/"}
   */
  it('不传参', () => {
    expect(utils.parseParams(encodeURIComponent())).toEqual({})
  })
  it('参数未被encodeURIComponent', () => {
    expect(utils.parseParams('a=1&b=2')).toEqual({ a: '1', b: '2' })
  })
  it('参数被encodeURIComponent', () => {
    expect(utils.parseParams(encodeURIComponent('a=1&b=2'))).toEqual({ a: '1', b: '2' })
  })
  it('获取对应key字段值', () => {
    expect(utils.parseParams('a=1&b=2', 'a')).toBe('1')
    expect(utils.parseParams('a=1&b=2', 'b')).toBe('2')
  })
})

describe('utils-paramsToQuery方法', () => {
  it('参数为空', () => {
    expect(utils.paramsToQuery({})).toEqual('')
  })
  it('参数不为空', () => {
    expect(utils.paramsToQuery({ a: '1', b: '2' })).toEqual('a=1&b=2')
  })
  it('参数内包含特殊字符', () => {
    expect(utils.paramsToQuery({ a: '1', b: '2%' })).toEqual(`a=1&b=${encodeURIComponent('2%')}`)
  })
})

describe('utils-generatePlatformLink方法', () => {
  it('参数为空', () => {
    expect(utils.generatePlatformLink({})).toEqual({ scheme: '', https: '' })
  })
  it('支付宝-无page-无页面参数-无全局参数', () => {
    expect(utils.generatePlatformLink({ platform: 'ALIPAY', appId: '2021001155666499' })).toEqual({
      scheme: 'alipays://platformapi/startapp?appId=2021001155666499',
      https: 'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001155666499'
    })
  })
  it('支付宝-有page-无页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'ALIPAY',
        appId: '2021001155666499',
        page: 'pages/tabbar/dashboard/dashboard'
      })
    ).toEqual({
      scheme: 'alipays://platformapi/startapp?appId=2021001155666499&page=pages/tabbar/dashboard/dashboard',
      https:
        'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001155666499%26page%3Dpages%2Ftabbar%2Fdashboard%2Fdashboard'
    })
  })
  it('支付宝-有page-有页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'ALIPAY',
        appId: '2021001155666499',
        page: 'others/good-detail/good-detail?id=111'
      })
    ).toEqual({
      scheme: 'alipays://platformapi/startapp?appId=2021001155666499&page=others/good-detail/good-detail%3Fid%3D111',
      https:
        'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001155666499%26page%3Dothers%2Fgood-detail%2Fgood-detail%253Fid%253D111'
    })
  })
  it('支付宝-有page-有页面参数-有全局参数并且为string', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'ALIPAY',
        appId: '2021001155666499',
        page: 'others/good-detail/good-detail?id=111',
        query: 'quotientScene=aa_bb'
      })
    ).toEqual({
      scheme:
        'alipays://platformapi/startapp?appId=2021001155666499&page=others/good-detail/good-detail%3Fid%3D111&query=quotientScene%3Daa_bb',
      https:
        'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001155666499%26page%3Dothers%2Fgood-detail%2Fgood-detail%253Fid%253D111%26query%3DquotientScene%253Daa_bb'
    })
  })
  it('支付宝-有page-有页面参数-有全局参数并且为object', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'ALIPAY',
        appId: '2021001155666499',
        page: 'others/good-detail/good-detail?id=111',
        query: { quotientScene: 'aa_bb' }
      })
    ).toEqual({
      scheme:
        'alipays://platformapi/startapp?appId=2021001155666499&page=others/good-detail/good-detail%3Fid%3D111&query=quotientScene%3Daa_bb',
      https:
        'https://ds.alipay.com/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021001155666499%26page%3Dothers%2Fgood-detail%2Fgood-detail%253Fid%253D111%26query%3DquotientScene%253Daa_bb'
    })
  })
  it('微信-无page-无页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'WECHAT',
        appId: 'wx7157b7ee8d09ee9f',
        miniType: '6'
      })
    ).toEqual({
      scheme: 'weixin://dl/business/?appid=wx7157b7ee8d09ee9f&path=pages/tabbar/dashboard/dashboard',
      https: 'https://static.youpinhaoche.com/mini/to_schema.html?miniType=6&envVersion=release'
    })
  })
  it('微信-有page-无页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'WECHAT',
        appId: 'wx7157b7ee8d09ee9f',
        miniType: '6',
        page: 'pages/tabbar/dashboard/dashboard'
      })
    ).toEqual({
      scheme: 'weixin://dl/business/?appid=wx7157b7ee8d09ee9f&path=pages/tabbar/dashboard/dashboard',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?miniType=6&path=pages/tabbar/dashboard/dashboard&envVersion=release'
    })
  })
  it('微信-有page-有页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'WECHAT',
        appId: 'wx7157b7ee8d09ee9f',
        miniType: '6',
        page: 'others/good-detail/good-detail?id=111'
      })
    ).toEqual({
      scheme: 'weixin://dl/business/?appid=wx7157b7ee8d09ee9f&path=others/good-detail/good-detail&query=id%3D111',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?miniType=6&path=others/good-detail/good-detail&query=id%3D111&envVersion=release'
    })
  })
  it('微信-有page-有页面参数-有全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'WECHAT',
        appId: 'wx7157b7ee8d09ee9f',
        miniType: '6',
        page: 'others/good-detail/good-detail?id=111',
        query: 'quotientScene=aa_bb',
        envVersion: 'release'
      })
    ).toEqual({
      scheme:
        'weixin://dl/business/?appid=wx7157b7ee8d09ee9f&path=others/good-detail/good-detail&query=id%3D111%26quotientScene%3Daa_bb',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?miniType=6&path=others/good-detail/good-detail&query=id%3D111%26quotientScene%3Daa_bb&envVersion=release'
    })
  })
  it('字节-无page-无页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'BYTEDANCE',
        appId: 'tt6c8e1a33f3b48307',
        miniType: '2'
      })
    ).toEqual({
      scheme: '',
      https: 'https://static.youpinhaoche.com/mini/to_schema.html?miniType=2&query={}&envVersion=release'
    })
  })
  it('字节-有page-无页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'BYTEDANCE',
        appId: 'tt6c8e1a33f3b48307',
        miniType: '2',
        page: 'pages/tabbar/dashboard/dashboard'
      })
    ).toEqual({
      scheme: '',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?miniType=2&path=pages/tabbar/dashboard/dashboard&query={}&envVersion=release'
    })
  })
  it('字节-有page-有页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'BYTEDANCE',
        appId: 'tt6c8e1a33f3b48307',
        miniType: '2',
        page: 'others/good-detail/good-detail?id=111'
      })
    ).toEqual({
      scheme: '',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?miniType=2&path=others/good-detail/good-detail&query={"id":"111"}&envVersion=release'
    })
  })
  it('字节-有page-有页面参数-有全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'BYTEDANCE',
        appId: 'tt6c8e1a33f3b48307',
        miniType: '2',
        page: 'others/good-detail/good-detail?id=111',
        query: 'quotientScene=aa_bb',
        envVersion: 'release'
      })
    ).toEqual({
      scheme: '',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?miniType=2&path=others/good-detail/good-detail&query={"id":"111","quotientScene":"aa_bb"}&envVersion=release'
    })
  })
  it('京东金融-有page-有页面参数-有全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'JD',
        appId: '3DE6A10EDB4F7DF38ECA9C11516FBA65',
        miniType: 41,
        page: 'pages/tabbar/dashboard/dashboard',
        query: { quotientScene: '10000564_abc', urlCode: 'mejrism0-dj4afzwxv9d' },
        jdType: 'jdjr'
      })
    ).toEqual({
      scheme:
        'openjdjrapp://com.jd.jrapp/jdminiprogram/open?jrparam={"type":{"category":"jump","des":"jdmp","appId":"3DE6A10EDB4F7DF38ECA9C11516FBA65","vapptype":1,"param":{"quotientScene":"10000564_abc","urlCode":"mejrism0-dj4afzwxv9d"},"path":"pages/tabbar/dashboard/dashboard.html"}}&jrlogin=false&jrcontainer=native',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?scheme=openjdjrapp%3A%2F%2Fcom.jd.jrapp%2Fjdminiprogram%2Fopen%3Fjrparam%3D%7B%22type%22%3A%7B%22category%22%3A%22jump%22%2C%22des%22%3A%22jdmp%22%2C%22appId%22%3A%223DE6A10EDB4F7DF38ECA9C11516FBA65%22%2C%22vapptype%22%3A1%2C%22param%22%3A%7B%22quotientScene%22%3A%2210000564_abc%22%2C%22urlCode%22%3A%22mejrism0-dj4afzwxv9d%22%7D%2C%22path%22%3A%22pages%2Ftabbar%2Fdashboard%2Fdashboard.html%22%7D%7D%26jrlogin%3Dfalse%26jrcontainer%3Dnative'
    })
  })
  it('京东金融-有page-有页面参数-无全局参数', () => {
    expect(
      utils.generatePlatformLink({
        platform: 'JD',
        appId: '3DE6A10EDB4F7DF38ECA9C11516FBA65',
        miniType: 41,
        page: 'pages/tabbar/dashboard/dashboard',
        jdType: 'jdjr'
      })
    ).toEqual({
      scheme:
        'openjdjrapp://com.jd.jrapp/jdminiprogram/open?jrparam={"type":{"category":"jump","des":"jdmp","appId":"3DE6A10EDB4F7DF38ECA9C11516FBA65","vapptype":1,"param":{},"path":"pages/tabbar/dashboard/dashboard.html"}}&jrlogin=false&jrcontainer=native',
      https:
        'https://static.youpinhaoche.com/mini/to_schema.html?scheme=openjdjrapp%3A%2F%2Fcom.jd.jrapp%2Fjdminiprogram%2Fopen%3Fjrparam%3D%7B%22type%22%3A%7B%22category%22%3A%22jump%22%2C%22des%22%3A%22jdmp%22%2C%22appId%22%3A%223DE6A10EDB4F7DF38ECA9C11516FBA65%22%2C%22vapptype%22%3A1%2C%22param%22%3A%7B%7D%2C%22path%22%3A%22pages%2Ftabbar%2Fdashboard%2Fdashboard.html%22%7D%7D%26jrlogin%3Dfalse%26jrcontainer%3Dnative'
    })
  })
})

describe('utils-generateSelectOption方法', () => {
  it('参数为空', () => {
    expect(utils.generateSelectOption()).toEqual([])
  })
  it('参数无labelKey、valueKey', () => {
    expect(utils.generateSelectOption([{ label: '1', value: '1' }])).toEqual([{ label: '1', value: '1' }])
  })
  it('参数有labelKey、valueKey', () => {
    expect(utils.generateSelectOption([{ dictLabel: '1', dictValue: '1' }], 'dictLabel', 'dictValue')).toEqual([
      { label: '1', value: '1' }
    ])
  })
})

describe('utils-findValueToLabel方法', () => {
  it('参数为空', () => {
    expect(utils.findValueToLabel()).toEqual(null)
  })
  it('参数无defaultValue', () => {
    expect(utils.findValueToLabel([{ label: '优品租', value: '6' }], '6')).toEqual('优品租')
  })
  it('参数有defaultValue', () => {
    expect(utils.findValueToLabel([{ label: '优品租', value: '6' }], '7', { defaultValue: '--' })).toEqual('--')
  })
  it('参数有option', () => {
    expect(
      utils.findValueToLabel([{ dictLabel: '优品租', dictValue: '6' }], '6', {
        labelKey: 'dictLabel',
        valueKey: 'dictValue'
      })
    ).toEqual('优品租')
  })
})

describe('utils-debounce方法', () => {
  jest.useFakeTimers()
  it('未规定指定时间，按照默认200ms', () => {
    const func = jest.fn()
    const debouncedFunc = utils.debounce(func)
    debouncedFunc()
    expect(func).not.toBeCalled()
    jest.advanceTimersByTime(200)
    expect(func).toHaveBeenCalled()
  })
  it('应该在指定延迟后只调用一次函数', () => {
    const func = jest.fn()
    const debouncedFunc = utils.debounce(func, 1000)
    debouncedFunc()
    debouncedFunc()
    debouncedFunc()
    expect(func).not.toBeCalled()
    jest.advanceTimersByTime(1000)
    expect(func).toHaveBeenCalledTimes(1)
  })
  it('cancel 方法应该能取消待执行的函数调用', () => {
    const func = jest.fn()
    const debouncedFunc = utils.debounce(func, 1000)
    debouncedFunc()
    jest.advanceTimersByTime(500)
    debouncedFunc.cancel()
    jest.advanceTimersByTime(500)
    debouncedFunc.cancel()
    expect(func).not.toBeCalled()
  })
  it('应该使用最后一次调用的参数', () => {
    const func = jest.fn()
    const debouncedFunc = utils.debounce(func, 1000)
    debouncedFunc('first')
    debouncedFunc('second')
    debouncedFunc('third')
    jest.advanceTimersByTime(1000)
    expect(func).toHaveBeenCalledWith('third')
  })
  it('应该保持正确的 this 上下文', () => {
    const context = { value: 'test' }
    const func = jest.fn(function (arg) {
      expect(this.value).toBe('test')
      return arg
    })
    const debounce = utils.debounce(func, 500)
    debounce.call(context, 'arg')
    jest.advanceTimersByTime(500)
    expect(func.mock.results[0].value).toBe('arg')
    expect(func).toHaveBeenCalledWith('arg')
  })
})

describe('utils-throttle方法', () => {
  jest.useFakeTimers()
  it('未规定指定时间，按照默认200ms', () => {
    const func = jest.fn()
    const throttled = utils.throttle(func)
    throttled()
    throttled()
    throttled()
    expect(func).toHaveBeenCalled()
    expect(func).toHaveBeenCalledTimes(1)
  })
  it('应该在等待时间后能再次执行', () => {
    const func = jest.fn()
    const throttled = utils.throttle(func, 500)
    throttled()
    expect(func).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(500)
    throttled()
    expect(func).toHaveBeenCalledTimes(2)
  })
  it('leading=false 应该禁止第一次立即执行', () => {
    const func = jest.fn()
    const throttled = utils.throttle(func, 500, { leading: false })
    throttled()
    expect(func).not.toHaveBeenCalled()
    jest.advanceTimersByTime(500)
    expect(func).toHaveBeenCalledTimes(1)
  })
  it('trailing=false 应该禁止最后一次执行', () => {
    const func = jest.fn()
    const throttled = utils.throttle(func, 500, { trailing: false })
    throttled()
    jest.advanceTimersByTime(200)
    expect(func).toHaveBeenCalledTimes(1)
    throttled()
    jest.advanceTimersByTime(300)
    expect(func).toHaveBeenCalledTimes(1)
  })
  it('cancel 方法应该能取消待执行的调用', () => {
    const func = jest.fn()
    const throttled = utils.throttle(func, 500)
    throttled()
    jest.advanceTimersByTime(200)
    throttled()
    throttled.cancel()
    jest.advanceTimersByTime(300)
    throttled.cancel()
    expect(func).toHaveBeenCalledTimes(1)
  })
  it('应该保持正确的函数上下文和参数', () => {
    const context = { value: 'test' }
    const func = jest.fn(function (arg) {
      expect(this.value).toBe('test')
      return arg
    })
    const throttled = utils.throttle(func, 500)
    const result = throttled.call(context, 'arg')
    expect(result).toBe('arg')
    expect(func).toHaveBeenCalledWith('arg')
  })
})

describe('utils-deepClone方法', () => {
  it('应该正确克隆基本类型', () => {
    expect(utils.deepClone(123)).toBe(123)
    expect(utils.deepClone('test')).toBe('test')
    expect(utils.deepClone(true)).toBe(true)
    expect(utils.deepClone(null)).toBe(null)
    expect(utils.deepClone(undefined)).toBe(undefined)
  })
  it('应该正确克隆日期对象', () => {
    const date = new Date('2024-01-01')
    const clonedDate = utils.deepClone(date)
    expect(clonedDate).toBeInstanceOf(Date)
    expect(clonedDate.getTime()).toBe(date.getTime())
    expect(clonedDate).not.toBe(date) // 确保是新的实例
  })
  it('应该正确克隆数组', () => {
    const array = [1, 'test', { a: 1 }, [2, 3]]
    const clonedArray = utils.deepClone(array)
    expect(clonedArray).toEqual(array)
    expect(clonedArray).not.toBe(array)
    expect(clonedArray[2]).not.toBe(array[2])
    expect(clonedArray[3]).not.toBe(array[3])
  })
  it('应该正确克隆对象', () => {
    const obj = {
      a: 1,
      b: 'test',
      c: { d: 2 },
      e: [1, 2, { f: 3 }]
    }
    const clonedObj = utils.deepClone(obj)
    expect(clonedObj).toEqual(obj)
    expect(clonedObj).not.toBe(obj)
    expect(clonedObj.c).not.toBe(obj.c)
    expect(clonedObj.e).not.toBe(obj.e)
    expect(clonedObj.e[2]).not.toBe(obj.e[2])
  })
  it('应该正确处理循环引用', () => {
    const obj = { a: 1 }
    obj.self = obj
    expect(() => utils.deepClone(obj)).not.toThrow()
  })
})

describe('utils-generateUID方法', () => {
  it('应该生成唯一的UID', () => {
    const uids = new Set()
    for (let i = 0; i < 1000; i++) {
      const uid = utils.generateUID()
      expect(uid).toMatch(/^[0-9a-z]{8}-[0-9a-z]{8}$/)
      expect(uids.has(uid)).toBeFalsy()
      uids.add(uid)
    }
  })
})

describe('utils-downloadFile方法', () => {
  let createObjectURLMock
  let revokeObjectURLMock

  beforeEach(() => {
    createObjectURLMock = jest.fn(() => 'mock-url')
    revokeObjectURLMock = jest.fn()
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock
    document.body.innerHTML = ''
  })

  it('应该正常下载文件', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' })
    const fileName = 'test.txt'
    utils.downloadFile(blob, fileName)
    // 验证是否调用了相关方法
    expect(createObjectURLMock).toHaveBeenCalledWith(blob)
    expect(revokeObjectURLMock).toHaveBeenCalledWith('mock-url')
  })

  it('在 IE 浏览器中应该使用 msSaveBlob', () => {
    const msSaveBlobMock = jest.fn()
    const originalNavigator = window.navigator
    Object.defineProperty(window, 'navigator', {
      value: {
        msSaveOrOpenBlob: true,
        msSaveBlob: msSaveBlobMock
      },
      writable: true
    })
    const blob = new Blob(['test content'], { type: 'text/plain' })
    const fileName = 'test.txt'
    utils.downloadFile(blob, fileName)
    expect(msSaveBlobMock).toHaveBeenCalledWith(blob, fileName)
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true
    })
  })

  it('下载失败时应该抛出错误', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' })
    const fileName = 'test.txt'
    window.URL.createObjectURL = jest.fn(() => {
      throw new Error('模拟的错误')
    })
    expect(() => {
      utils.downloadFile(blob, fileName)
    }).toThrow('文件下载失败: 模拟的错误')
  })

  it('下载失败时应该处理未知错误', () => {
    const blob = new Blob(['test content'], { type: 'text/plain' })
    const fileName = 'test.txt'
    window.URL.createObjectURL = jest.fn(() => {
      // eslint-disable-next-line no-throw-literal
      throw '未知错误'
    })
    expect(() => {
      utils.downloadFile(blob, fileName)
    }).toThrow('文件下载失败: 未知错误')
  })
})

describe('utils-dataURLtoBlob方法', () => {
  it('应该正确转换有效的Data URL', () => {
    const dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    const blob = utils.dataURLtoBlob(dataUrl)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('image/png')
  })
  it('应该正确处理不同MIME类型', () => {
    const dataUrl = 'data:text/plain;base64,SGVsbG8gV29ybGQ='
    const blob = utils.dataURLtoBlob(dataUrl)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('text/plain')
  })

  it('应该在Data URL格式无效时抛出错误', () => {
    const invalidDataUrl = 'invalid-data-url'
    expect(() => {
      utils.dataURLtoBlob(invalidDataUrl)
    }).toThrow('转换 Data URL 到 Blob 失败: 无效的 Data URL 格式')
  })

  it('应该在缺少MIME类型时抛出错误', () => {
    const invalidDataUrl = 'data:base64,SGVsbG8gV29ybGQ='
    expect(() => {
      utils.dataURLtoBlob(invalidDataUrl)
    }).toThrow('转换 Data URL 到 Blob 失败: 无效的 Data URL 格式')
  })

  it('应该在base64解码失败时抛出错误', () => {
    const originalAtob = window.atob
    window.atob = jest.fn(() => {
      // eslint-disable-next-line no-throw-literal
      throw '模拟的错误'
    })
    const invalidBase64DataUrl = 'data:image/png;base64,Invalid-Base64!'
    expect(() => {
      utils.dataURLtoBlob(invalidBase64DataUrl)
    }).toThrow('转换 Data URL 到 Blob 失败: 未知错误')
    window.atob = originalAtob
  })
})

describe('utils-copyText方法', () => {
  let originalClipboard
  let originalExecCommand
  beforeAll(() => {
    // 只需记录一次原始值
    originalClipboard = navigator.clipboard
    originalExecCommand = document.execCommand
  })
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true
    })
    document.execCommand = originalExecCommand
    document.body.innerHTML = ''
  })
  it('当 navigator.clipboard 可用时应该使用 clipboard API', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true
    })
    const result = await utils.copyText('test text')
    expect(mockWriteText).toHaveBeenCalledWith('test text')
    expect(result).toBe(true)
  })
  it('当 navigator.clipboard 不可用时应该使用 execCommand', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true
    })
    document.execCommand = jest.fn().mockReturnValue(true)
    const result = await utils.copyText('test text')
    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result).toBe(true)
    expect(document.body.children.length).toBe(0)
  })
  it('当复制失败时应该返回 false', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard error'))
      },
      writable: true
    })
    const result = await utils.copyText('test text')
    expect(result).toBe(false)
  })
  it('当 execCommand 失败时应该返回 false', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true
    })
    document.execCommand = jest.fn().mockReturnValue(false)
    const result = await utils.copyText('test text')
    expect(result).toBe(false)
    expect(document.body.children.length).toBe(0)
  })
})

describe('utils-getImageDimensions方法', () => {
  let createObjectURLMock
  let revokeObjectURLMock
  beforeEach(() => {
    createObjectURLMock = jest.fn(() => 'mock-url')
    revokeObjectURLMock = jest.fn()
    window.URL.createObjectURL = createObjectURLMock
    window.URL.revokeObjectURL = revokeObjectURLMock
  })
  afterAll(() => {
    jest.restoreAllMocks()
  })
  it('测试file 不是 image类型', async () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' })
    expect(utils.getImageDimensions(file)).rejects.toThrow('文件不是图片类型')
  })
  it('测试图片加载成功', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' })
    const mockImage = {
      width: 200,
      height: 100,
      onload: null,
      onerror: null,
      src: ''
    }
    global.Image = jest.fn().mockImplementation(() => mockImage)
    expect(utils.getImageDimensions(file)).resolves.toEqual({ width: 200, height: 100 })
    mockImage.onload()
  })
  it('测试图片加载失败', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' })
    const mockImage = {
      width: 200,
      height: 100,
      onload: null,
      onerror: null,
      src: ''
    }
    global.Image = jest.fn().mockImplementation(() => mockImage)
    expect(utils.getImageDimensions(file)).rejects.toThrow('图片加载失败')
    mockImage.onerror()
  })
})

describe('utils-regBodyDom方法', () => {
  it('测试无参数', () => {
    expect(utils.regBodyDom()).toBe('')
  })
  it('测试body标签内的有内容', () => {
    expect(utils.regBodyDom('<body><div>test</div></body>')).toBe('<div>test</div>')
  })
  it('测试body标签内的无内容', () => {
    expect(utils.regBodyDom('<body></body>')).toBe('')
  })
})

describe('utils-formatSeconds方法', () => {
  it('测试无参数', () => {
    expect(utils.formatSeconds()).toBe('00:00:00')
  })
  it('测试HH:mm:ss格式', () => {
    expect(utils.formatSeconds(3661)).toBe('01:01:01')
  })
  it('测试HH时mm分ss秒格式', () => {
    expect(utils.formatSeconds(3661, 'HH时mm分ss秒')).toBe('01时01分01秒')
  })
  it('测试', () => {
    expect(utils.formatSeconds(3661, 'H时m分s秒')).toBe('H时m分s秒')
  })
})

describe('utils-isEmpty方法', () => {
  it('应该正确判断null和undefined', () => {
    expect(utils.isEmpty(null)).toBe(true)
    expect(utils.isEmpty(undefined)).toBe(true)
  })
  it('应该正确判断空字符串和包含空格的字符串', () => {
    expect(utils.isEmpty('')).toBe(true)
    expect(utils.isEmpty('   ')).toBe(true)
    expect(utils.isEmpty('test')).toBe(false)
    expect(utils.isEmpty(' test ')).toBe(false)
  })
  it('应该正确判断数组', () => {
    expect(utils.isEmpty([])).toBe(true)
    expect(utils.isEmpty([1, 2, 3])).toBe(false)
  })
  it('应该正确判断对象', () => {
    expect(utils.isEmpty({})).toBe(true)
    expect(utils.isEmpty({ key: 'value' })).toBe(false)
  })
  it('应该对其他类型返回false', () => {
    expect(utils.isEmpty(0)).toBe(false)
    expect(utils.isEmpty(false)).toBe(false)
    expect(utils.isEmpty(true)).toBe(false)
    expect(utils.isEmpty(new Date())).toBe(false)
  })
})

describe('utils-setWaterMark方法', () => {
  let canvasMock
  let ctxMock

  beforeEach(() => {
    document.body.innerHTML = ''
    ctxMock = {
      font: '',
      fillStyle: '',
      textAlign: '',
      save: jest.fn(),
      restore: jest.fn(),
      rotate: jest.fn(),
      fillText: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 100 })
    }
    canvasMock = {
      getContext: jest.fn().mockReturnValue(ctxMock),
      toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test'),
      width: 0,
      height: 0
    }
    const originalCreateElement = document.createElement
    jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'canvas') {
        return canvasMock
      }
      return originalCreateElement.call(document, tagName)
    })
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('应该移除已存在的水印元素', () => {
    const existingWatermark = document.createElement('div')
    existingWatermark.id = 'waterMarkContent'
    document.body.appendChild(existingWatermark)
    utils.setWaterMark('测试水印')
    expect(document.querySelectorAll('#waterMarkContent').length).toBe(1)
  })

  it('应该创建新的水印元素并添加到body', () => {
    utils.setWaterMark('测试水印')
    const watermark = document.getElementById('waterMarkContent')
    expect(watermark).toBeTruthy()
    expect(watermark?.style.backgroundImage).toBe('url(data:image/png;base64,test)')
    expect(watermark?.style.position).toBe('fixed')
    expect(watermark?.style.pointerEvents).toBe('none')
    expect(watermark?.style.top).toBe('0px')
    expect(watermark?.style.left).toBe('200px')
    expect(watermark?.style.right).toBe('0px')
    expect(watermark?.style.bottom).toBe('0px')
    expect(watermark?.style.zIndex).toBe('999999')
    expect(watermark?.style.backgroundRepeat).toBe('repeat')
  })
  it('应该正确设置 canvas 上下文属性', () => {
    utils.setWaterMark('测试水印')
    expect(canvasMock.width).toBe(250)
    expect(canvasMock.height).toBe(180)
    expect(ctxMock.font).toBe(
      '100 14px "PingFangSC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
    )
    expect(ctxMock.fillStyle).toBe('rgba(0,0,0,0.2)')
    expect(ctxMock.textAlign).toBe('center')
  })
  it('应该在不支持 canvas 时提前返回', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    document.createElement('canvas').getContext = () => null
    utils.setWaterMark('测试水印')
    expect(consoleSpy).toHaveBeenCalledWith('浏览器不支持canvas')
    consoleSpy.mockRestore()
  })
  it('测试文本为空', () => {
    const longText = ''
    utils.setWaterMark(longText)
    expect(document.querySelectorAll('#waterMarkContent').length).toBe(0)
  })
  it('应该正确处理多行文本', () => {
    ctxMock.measureText = jest.fn().mockReturnValue({ width: 200 })
    const longText = '这是一段很长的水印文本，需要换行显示的内容'
    utils.setWaterMark(longText)
    expect(ctxMock.fillText).toHaveBeenCalled()
    expect(ctxMock.save).toHaveBeenCalled()
    expect(ctxMock.rotate).toHaveBeenCalledWith((-45 * Math.PI) / 180)
    expect(ctxMock.restore).toHaveBeenCalled()
  })
})

describe('utils-isIdCard方法', () => {
  it('应该正确验证基础格式', () => {
    // 有效的身份证号
    expect(utils.isIdCard('110101199003077758')).toBe(true)
    expect(utils.isIdCard('11010119900307775X')).toBe(true)
    expect(utils.isIdCard('11010119900307775x')).toBe(true)
    expect(utils.isIdCard('71010119900307775x')).toBe(true)
    expect(utils.isIdCard('81010119900307775x')).toBe(true)
    expect(utils.isIdCard('11010119900307775x')).toBe(true)
    expect(utils.isIdCard('11010119900307775X')).toBe(true)
    expect(utils.isIdCard('1101011990030777')).toBe(false)

    // 无效格式
    expect(utils.isIdCard('1234')).toBe(false)
    expect(utils.isIdCard('12345678901234567')).toBe(false)
    expect(utils.isIdCard('1234567890123456789')).toBe(false)
    expect(utils.isIdCard('11010119900307775Y')).toBe(false)
    expect(utils.isIdCard('110101199003077@5')).toBe(false)
  })
  it('应该正确验证15位身份证号', () => {
    // 有效的15位身份证号
    expect(utils.isIdCard('110101900307775')).toBe(true)
    expect(utils.isIdCard('110101850101123')).toBe(true)

    // 无效的15位身份证号
    expect(utils.isIdCard('11010190030777')).toBe(false) // 少一位
    expect(utils.isIdCard('1101019003077755')).toBe(false) // 多一位
    expect(utils.isIdCard('11010190030777X')).toBe(false) // 包含无效字符
  })
  it('应该正确处理特殊输入', () => {
    // 空值或非字符串
    expect(utils.isIdCard('')).toBe(false)
    expect(utils.isIdCard(null)).toBe(false)
    expect(utils.isIdCard(undefined)).toBe(false)
    expect(utils.isIdCard(123456789012345678n)).toBe(false)

    // 包含空格
    expect(utils.isIdCard(' 110101199003077758')).toBe(false)
    expect(utils.isIdCard('110101199003077758 ')).toBe(false)
    expect(utils.isIdCard('1101011990 03077758')).toBe(false)
  })

  it('应该正确验证年份范围', () => {
    // 有效年份范围
    expect(utils.isIdCard('110101190001017758')).toBe(true) // 1900年
    expect(utils.isIdCard('110101200001017758')).toBe(true) // 2000年

    // 无效年份范围（根据正则限制只能是19xx或20xx）
    expect(utils.isIdCard('110101189901017758')).toBe(false) // 1899年
    expect(utils.isIdCard('110101210001017758')).toBe(false) // 2100年
  })
})
describe('utils-isPhone方法', () => {
  it('应该正确验证手机号', () => {
    // 有效手机号
    expect(utils.isPhone('13812345678')).toBe(true)
    expect(utils.isPhone('15912345678')).toBe(true)
    expect(utils.isPhone('17612345678')).toBe(true)

    // 无效手机号
    expect(utils.isPhone('138123456789')).toBe(false)
    expect(utils.isPhone('1381234567')).toBe(false)
    expect(utils.isPhone('1')).toBe(false)
    expect(utils.isPhone('')).toBe(false)
    expect(utils.isPhone(null)).toBe(false)
    expect(utils.isPhone(undefined)).toBe(false)
    expect(utils.isPhone(123456789012345678n)).toBe(false)
  })
})
describe('utils-desensitize方法', () => {
  it('应该正确处理空值和非字符串输入', () => {
    expect(utils.desensitize('')).toBe('')
    expect(utils.desensitize(null)).toBe(null)
    expect(utils.desensitize(undefined)).toBe(undefined)
    expect(utils.desensitize(123456789)).toBe(123456789)
    expect(utils.desensitize(123456789, { type: 'phone' })).toBe(123456789)
  })

  it('应该正确处理手机号脱敏', () => {
    // 标准11位手机号
    expect(utils.desensitize('13812345678', { type: 'phone' })).toBe('138****5678')
    expect(utils.desensitize('15912345678', { type: 'phone' })).toBe('159****5678')
    expect(utils.desensitize('17612345678', { type: 'phone' })).toBe('176****5678')

    // 自定义掩码字符
    expect(utils.desensitize('13812345678', { type: 'phone', mask: '#' })).toBe('138####5678')

    // 自定义显示长度
    expect(utils.desensitize('13812345678', { type: 'phone', start: 4, end: 3 })).toBe('1381****678')
    expect(utils.desensitize('13812345678', { type: 'phone', start: 2, end: 5 })).toBe('13****45678')
  })

  it('应该正确处理非标准长度的输入', () => {
    // 短号码
    expect(utils.desensitize('1234567', { type: 'phone' })).toBe('1234567')

    // 长号码
    expect(utils.desensitize('138123456789', { type: 'phone' })).toBe('138****6789')
  })
  it('应该正确处理身份证脱敏', () => {
    expect(utils.desensitize('110101199003077758', { type: 'idcard' })).toBe('110***********7758')
    expect(utils.desensitize('110101199003077758', { type: 'idcard', mask: '#' })).toBe('110###########7758')
    expect(utils.desensitize('340621999913265612', { type: 'idcard', start: 6, end: 4 })).toBe('340621********5612')
    expect(utils.desensitize('340621999913265612', { type: 'idcard', start: 2, end: 5 })).toBe('34***********65612')
    expect(utils.desensitize('34062199991', { type: 'idcard', start: 2, end: 5 })).toBe('34****99991')
  })
  it('应该正确处理无type参数的情况', () => {
    expect(utils.desensitize('13812345678')).toBe('13812345678')
    expect(utils.desensitize('13812345678', {})).toBe('13812345678')
    expect(utils.desensitize('13812345678', { start: 3, end: 4 })).toBe('13812345678')
    expect(utils.desensitize('13812345678', { start: 3, end: 4, type: 'hhh' })).toBe('13812345678')
  })

  it('应该正确处理邮箱脱敏', () => {
    // 标准邮箱格式
    expect(utils.desensitize('test@example.com', { type: 'email' })).toBe('tes****@example.com')
    expect(utils.desensitize('user@domain.com', { type: 'email' })).toBe('use****@domain.com')
    expect(utils.desensitize('long.name@company.com', { type: 'email' })).toBe('lon****@company.com')

    // 短用户名邮箱
    expect(utils.desensitize('a@example.com', { type: 'email' })).toBe('a****@example.com')
    expect(utils.desensitize('ab@example.com', { type: 'email' })).toBe('ab****@example.com')
    expect(utils.desensitize('abc@example.com', { type: 'email' })).toBe('abc****@example.com')

    // 自定义掩码字符
    expect(utils.desensitize('test@example.com', { type: 'email', mask: '#' })).toBe('tes####@example.com')
    expect(utils.desensitize('test@example.com', { type: 'email', mask: '-' })).toBe('tes----@example.com')

    // 自定义显示长度
    expect(utils.desensitize('test@example.com', { type: 'email', start: 2 })).toBe('te****@example.com')
    expect(utils.desensitize('test@example.com', { type: 'email', start: 4 })).toBe('test****@example.com')
    expect(utils.desensitize('test@example.com', { type: 'email', end: 5 })).toBe('tes****e.com')
    expect(utils.desensitize('test@example.com', { type: 'email', end: 6 })).toBe('tes****le.com')
    expect(utils.desensitize('st@example.com', { type: 'email', end: 6 })).toBe('st****le.com')
    expect(utils.desensitize('st@example.com', { type: 'email', start: 5, end: 6 })).toBe('st****le.com')
  })

  it('应该正确处理特殊格式的邮箱', () => {
    // 多级域名
    expect(utils.desensitize('user@sub.example.com', { type: 'email' })).toBe('use****@sub.example.com')
    expect(utils.desensitize('test@mail.company.co.uk', { type: 'email' })).toBe('tes****@mail.company.co.uk')

    // 包含特殊字符的用户名
    expect(utils.desensitize('first.last@example.com', { type: 'email' })).toBe('fir****@example.com')
    expect(utils.desensitize('user_name@example.com', { type: 'email' })).toBe('use****@example.com')
    expect(utils.desensitize('user+tag@example.com', { type: 'email' })).toBe('use****@example.com')
  })

  it('应该正确处理无效的邮箱格式', () => {
    // 无@符号
    expect(utils.desensitize('invalidemail', { type: 'email' })).toBe('invalidemail')
    expect(utils.desensitize('test.example.com', { type: 'email' })).toBe('test.example.com')

    // @符号位置异常
    expect(utils.desensitize('@example.com', { type: 'email' })).toBe('@example.com')
    expect(utils.desensitize('test@', { type: 'email' })).toBe('test@')

    // 长度不足
    expect(utils.desensitize('a@b.c', { type: 'email' })).toBe('a@b.c')
    expect(utils.desensitize('ab@c', { type: 'email' })).toBe('ab@c')
    expect(utils.desensitize('ab@c', { type: 'email', start: 1 })).toBe('ab@c')
  })

  it('应该正确处理姓名脱敏', () => {
    // 标准中文姓名
    expect(utils.desensitize('张三', { type: 'name' })).toBe('张*')
    expect(utils.desensitize('李四五', { type: 'name' })).toBe('李*五')
    expect(utils.desensitize('王小明', { type: 'name' })).toBe('王*明')

    // 英文姓名
    expect(utils.desensitize('Tom', { type: 'name' })).toBe('T*m')
    expect(utils.desensitize('Jerry', { type: 'name' })).toBe('J***y')
    expect(utils.desensitize('Tony Stark', { type: 'name' })).toBe('T********k')

    // 自定义掩码字符
    expect(utils.desensitize('张三丰', { type: 'name', mask: '#' })).toBe('张#丰')
    expect(utils.desensitize('李四', { type: 'name', mask: '*' })).toBe('李*')

    // 自定义显示长度
    expect(utils.desensitize('张三丰', { type: 'name' })).toBe('张*丰')
    expect(utils.desensitize('诸葛亮', { type: 'name' })).toBe('诸*亮')
    expect(utils.desensitize('司马懿', { type: 'name' })).toBe('司*懿')
  })
})

describe('utils-schemeToParams方法', () => {
  it('非 alipays: 开头的 scheme 应返回错误消息', () => {
    expect(utils.schemeToParams('weixin://test')).toEqual({
      message: '! 非 alipays: 开头'
    })
  })

  it('appId 不是 16 位应返回错误消息', () => {
    expect(utils.schemeToParams('alipays://platformapi/startapp?appId=12345')).toEqual({
      message: "! 非 16 位 appId '12345'"
    })
  })

  it('不支持的参数应返回错误消息', () => {
    expect(utils.schemeToParams('alipays://platformapi/startapp?unsupported=value')).toEqual({
      message: "! 不支持参数 'unsupported'"
    })
  })

  it('应正确解析有效的 scheme（仅包含 appId）', () => {
    expect(utils.schemeToParams('alipays://platformapi/startapp?appId=2021001155666499')).toEqual({
      params: {
        appId: '2021001155666499'
      }
    })
  })

  it('应正确解析有效的 scheme（包含 page）', () => {
    expect(
      utils.schemeToParams('alipays://platformapi/startapp?appId=2021001155666499&page=pages%2Findex%2Findex')
    ).toEqual({
      params: {
        appId: '2021001155666499',
        path: 'pages/index/index'
      }
    })
  })

  it('应正确解析有效的 scheme（包含 query）', () => {
    expect(
      utils.schemeToParams(
        'alipays://platformapi/startapp?appId=2021001155666499&page=others/good-detail/good-detail%3Fid%3D10005628&query=quotientScene%3D354_wwwwwe%26urlCode%3Dm7bief77-7wqdj7dd4cy'
      )
    ).toEqual({
      params: {
        appId: '2021001155666499',
        path: 'others/good-detail/good-detail?id=10005628',
        query: {
          quotientScene: '354_wwwwwe',
          urlCode: 'm7bief77-7wqdj7dd4cy'
        }
      }
    })
  })

  it('应正确解析完整的 scheme（包含所有参数）', () => {
    expect(
      utils.schemeToParams(
        'alipays://platformapi/startapp?appId=2021001155666499&page=pages/index/index&query=id%3D123%26type%3Dtest'
      )
    ).toEqual({
      params: {
        appId: '2021001155666499',
        path: 'pages/index/index',
        query: {
          id: '123',
          type: 'test'
        }
      }
    })
  })

  it('应正确处理 URL 编码的参数', () => {
    expect(
      utils.schemeToParams(
        'alipays://platformapi/startapp?appId=2021001155666499&query=' + encodeURIComponent('key=测试&value=123')
      )
    ).toEqual({
      params: {
        appId: '2021001155666499',
        query: {
          key: '测试',
          value: '123'
        }
      }
    })
  })
  it('应正确处理 URL 编码的参数', () => {
    expect(
      utils.schemeToParams(
        'alipays://platformapi/startapp?appId=2021001155666499&query=' + encodeURIComponent('key测试&value=123')
      )
    ).toEqual({
      params: {
        appId: '2021001155666499',
        query: {
          value: '123'
        }
      }
    })
  })
  it('应正确处理空的查询参数', () => {
    expect(utils.schemeToParams('alipays://platformapi/startapp?appId=2021001155666499&query=')).toEqual({
      params: {
        appId: '2021001155666499',
        query: {}
      }
    })
  })

  it('应正确处理没有值的查询参数', () => {
    expect(utils.schemeToParams('alipays://platformapi/startapp?appId=2021001155666499&query=key')).toEqual({
      params: {
        appId: '2021001155666499',
        query: {}
      }
    })
  })
})

describe('utils-getURLParameters方法', () => {
  it('应正确解析包含查询参数的URL', () => {
    expect(utils.getURLParameters('https://example.com?name=张三&age=25')).toEqual({
      name: '张三',
      age: '25'
    })
  })

  it('应正确处理没有查询参数的URL', () => {
    expect(utils.getURLParameters('https://example.com')).toEqual({})
    expect(utils.getURLParameters('https://example.com/')).toEqual({})
    expect(utils.getURLParameters('https://example.com/path')).toEqual({})
  })

  it('应正确处理空查询参数', () => {
    expect(utils.getURLParameters('https://example.com?')).toEqual({})
  })

  it('应正确处理URL编码的参数', () => {
    expect(
      utils.getURLParameters(
        'https://example.com?name=' + encodeURIComponent('张三') + '&city=' + encodeURIComponent('北京')
      )
    ).toEqual({
      name: '张三',
      city: '北京'
    })
  })

  it('应正确处理特殊字符', () => {
    expect(
      utils.getURLParameters('https://example.com?query=hello+world&symbols=' + encodeURIComponent('!@#$%^&*()'))
    ).toEqual({
      query: 'hello+world',
      symbols: '!@#$%^&*()'
    })
  })

  it('应正确处理没有值的参数', () => {
    expect(utils.getURLParameters('https://example.com?param1=&param2=')).toEqual({
      param1: '',
      param2: ''
    })
  })

  it('应正确处理只有键没有值的参数', () => {
    expect(utils.getURLParameters('https://example.com?param1&param2')).toEqual({})
  })

  it('应正确处理重复的参数名', () => {
    // 注意：在这种情况下，后面的值会覆盖前面的值
    expect(utils.getURLParameters('https://example.com?name=张三&name=李四')).toEqual({
      name: '李四'
    })
  })

  it('应正确处理包含多个问号的URL', () => {
    expect(utils.getURLParameters('https://example.com?name=张三?age=25')).toEqual({
      name: '张三'
    })
  })

  it('应正确处理包含哈希的URL', () => {
    expect(utils.getURLParameters('https://example.com?name=张三&age=25#section1')).toEqual({
      name: '张三',
      age: '25#section1'
    })
  })

  it('应正确处理无效URL', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    expect(utils.getURLParameters(null)).toEqual({})
    expect(utils.getURLParameters(undefined)).toEqual({})
    expect(utils.getURLParameters(123)).toEqual({})
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
describe('utils-generateAlipayLongLink方法', () => {
  it('应正确处理有效的alipays链接', () => {
    const alipaysUrl = 'alipays://platformapi/startapp?appId=2021001155666499'
    const result = utils.generateAlipayLongLink(alipaysUrl)
    expect(typeof result).toBe('string')
    expect(result).toBe(`https://render.alipay.com/p/s/i/?scheme=${encodeURIComponent(alipaysUrl)}`)
  })

  it('应正确处理带参数的alipays链接', () => {
    const alipaysUrl = 'alipays://platformapi/startapp?appId=2021001155666499&page=pages/index/index'
    const result = utils.generateAlipayLongLink(alipaysUrl)
    expect(typeof result).toBe('string')
    expect(result).toBe(`https://render.alipay.com/p/s/i/?scheme=${encodeURIComponent(alipaysUrl)}`)
  })

  it('应正确处理带特殊字符的alipays链接', () => {
    const alipaysUrl = 'alipays://platformapi/startapp?appId=2021001155666499&query=key=测试&value=123'
    const result = utils.generateAlipayLongLink(alipaysUrl)
    expect(typeof result).toBe('string')
    expect(result).toBe(`https://render.alipay.com/p/s/i/?scheme=${encodeURIComponent(alipaysUrl)}`)
  })

  it('应返回错误信息当链接不是以alipays:开头', () => {
    const invalidUrl = 'https://example.com'
    const result = utils.generateAlipayLongLink(invalidUrl)
    expect(typeof result).toBe('object')
    expect(result).toHaveProperty('message')
    expect(result.message).toBe('! 非 alipays: 开头')
  })

  it('应返回错误信息当链接为空字符串', () => {
    const emptyUrl = ''
    const result = utils.generateAlipayLongLink(emptyUrl)
    expect(typeof result).toBe('object')
    expect(result).toHaveProperty('message')
    expect(result.message).toBe('! 非 alipays: 开头')
  })
})
describe('utils-generateAlipayScheme方法', () => {
  it('应正确生成基本的scheme链接和长链接', () => {
    const result = utils.generateAlipayScheme({
      appId: '2021001155666499',
      page: 'pages/index/index'
    })

    expect(result).toHaveProperty('fullScheme')
    expect(result).toHaveProperty('longLink')
    expect(result.fullScheme).toBe('alipays://platformapi/startapp?appId=2021001155666499&page=pages/index/index')
    expect(typeof result.longLink).toBe('string')
    expect(result.longLink).toBe(`https://render.alipay.com/p/s/i/?scheme=${encodeURIComponent(result.fullScheme)}`)
  })

  it('应正确处理页面参数', () => {
    const result = utils.generateAlipayScheme({
      appId: '2021001155666499',
      page: 'pages/detail/detail',
      pageQuery: { id: '123', type: 'product' }
    })

    expect(result.fullScheme).toBe(
      'alipays://platformapi/startapp?appId=2021001155666499&page=pages/detail/detail%3Fid%3D123%26type%3Dproduct'
    )
  })

  it('应正确处理全局参数', () => {
    const result = utils.generateAlipayScheme({
      appId: '2021001155666499',
      page: 'pages/index/index',
      globalQuery: { channel: 'app', source: 'home' }
    })

    expect(result.fullScheme).toBe(
      'alipays://platformapi/startapp?appId=2021001155666499&page=pages/index/index&query=channel%3Dapp%26source%3Dhome'
    )
  })

  it('应正确处理同时包含页面参数和全局参数', () => {
    const result = utils.generateAlipayScheme({
      appId: '2021001155666499',
      page: 'pages/detail/detail',
      pageQuery: { id: '123', type: 'product' },
      globalQuery: { channel: 'app', source: 'home' }
    })

    expect(result.fullScheme).toBe(
      'alipays://platformapi/startapp?appId=2021001155666499&page=pages/detail/detail%3Fid%3D123%26type%3Dproduct&query=channel%3Dapp%26source%3Dhome'
    )
  })

  it('应正确处理特殊字符', () => {
    const result = utils.generateAlipayScheme({
      appId: '2021001155666499',
      page: 'pages/search/search',
      pageQuery: { keyword: '测试 空格+特殊字符&=' }
    })

    const expectedKeyword = encodeURIComponent('测试 空格+特殊字符&=')
    expect(result.fullScheme).toContain(`keyword%3D${encodeURIComponent(expectedKeyword)}`)
  })
})

describe('utils-filterInvalidValues方法', () => {
  it('应该过滤掉undefined、null和空字符串', () => {
    const obj = {
      a: 1,
      b: 'test',
      c: undefined,
      d: null,
      e: '',
      f: 0,
      g: false
    }
    const result = utils.filterInvalidValues(obj)
    expect(result).toEqual({
      a: 1,
      b: 'test',
      f: 0,
      g: false
    })
  })

  it('应该返回空对象当输入全是无效值', () => {
    const obj = {
      a: undefined,
      b: null,
      c: ''
    }
    const result = utils.filterInvalidValues(obj)
    expect(result).toEqual({})
  })

  it('应该返回相同对象当没有无效值', () => {
    const obj = {
      a: 1,
      b: 'test',
      c: 0,
      d: false,
      e: []
    }
    const result = utils.filterInvalidValues(obj)
    expect(result).toEqual(obj)
  })

  it('应该正确处理嵌套对象', () => {
    const obj = {
      a: 1,
      b: {
        c: undefined,
        d: 'test'
      },
      e: null
    }
    const result = utils.filterInvalidValues(obj)
    // 注意：该方法不会递归处理嵌套对象内部的无效值
    expect(result).toEqual({
      a: 1,
      b: {
        c: undefined,
        d: 'test'
      }
    })
  })

  it('应该正确处理数组值', () => {
    const obj = {
      a: [1, 2, 3],
      b: [],
      c: null
    }
    const result = utils.filterInvalidValues(obj)
    expect(result).toEqual({
      a: [1, 2, 3],
      b: []
    })
  })

  it('应该正确处理空对象输入', () => {
    const result = utils.filterInvalidValues({})
    expect(result).toEqual({})
  })
})

describe('utils-isTrueName方法', () => {
  it('应该正确验证中文姓名', () => {
    // 有效的中文姓名
    expect(utils.isTrueName('张三')).toBe(true)
    expect(utils.isTrueName('李四')).toBe(true)
    expect(utils.isTrueName('王小明')).toBe(true)

    // 带点、·或。的中文姓名
    expect(utils.isTrueName('张.三')).toBe(true)
    expect(utils.isTrueName('李·四')).toBe(true)
    expect(utils.isTrueName('王。明')).toBe(true)

    // 无效的中文姓名
    expect(utils.isTrueName('张')).toBe(false) // 只有一个字
    expect(utils.isTrueName('张三.')).toBe(false) // 以点结尾
    expect(utils.isTrueName('.张三')).toBe(false) // 以点开头
    expect(utils.isTrueName('张三1')).toBe(false) // 包含数字
    expect(utils.isTrueName('张三!')).toBe(false) // 包含特殊字符
    expect(utils.isTrueName('张 三')).toBe(false) // 包含空格
  })

  it('应该正确验证英文姓名', () => {
    // 有效的英文姓名
    expect(utils.isTrueName('John')).toBe(true)
    expect(utils.isTrueName('Mary')).toBe(true)
    expect(utils.isTrueName('Tom')).toBe(true)
    expect(utils.isTrueName('John Smith')).toBe(true)

    // 无效的英文姓名
    expect(utils.isTrueName('J')).toBe(false) // 只有一个字母
    expect(utils.isTrueName('John1')).toBe(false) // 包含数字
    expect(utils.isTrueName('John!')).toBe(false) // 包含特殊字符
    expect(utils.isTrueName('John ')).toBe(false) // 以空格结尾
    expect(utils.isTrueName(' John')).toBe(false) // 以空格开头
    expect(utils.isTrueName('john')).toBe(true) // 全小写也是有效的
    expect(utils.isTrueName('JOHN')).toBe(true) // 全大写也是有效的
  })

  it('应该正确处理混合和特殊情况', () => {
    // 混合中英文
    expect(utils.isTrueName('张John')).toBe(false)
    expect(utils.isTrueName('John张')).toBe(false)

    // 空值和非字符串
    expect(utils.isTrueName('')).toBe(false)
    expect(utils.isTrueName(null)).toBe(false)
    expect(utils.isTrueName(undefined)).toBe(false)
    expect(utils.isTrueName(123)).toBe(false)
    expect(utils.isTrueName({})).toBe(false)
    expect(utils.isTrueName([])).toBe(false)

    // 特殊字符
    expect(utils.isTrueName('John-Smith')).toBe(false) // 包含连字符
    expect(utils.isTrueName("O'Neil")).toBe(false) // 包含撇号
  })

  it('应该正确处理边界情况', () => {
    // 刚好20个字符的名字
    const chineseNameMax = '王' + '三'.repeat(18) + '李'
    expect(utils.isTrueName(chineseNameMax)).toBe(true)

    const englishNameMax = 'A' + 'b'.repeat(18) + 'C'
    expect(utils.isTrueName(englishNameMax)).toBe(true)

    // 超过20个字符的名字
    const chineseNameTooLong = '王' + '三'.repeat(19) + '李'
    expect(utils.isTrueName(chineseNameTooLong)).toBe(false)

    const englishNameTooLong = 'A' + 'b'.repeat(19) + 'C'
    expect(utils.isTrueName(englishNameTooLong)).toBe(false)
  })
})
