/**
 * 解析字符串参数
 *
 * 将形如 "a=1&b=2" 的字符串解析为对象 {a: "1", b: "2"}，
 * 或者根据指定的 key 获取对应的值
 *
 * @param str - 要解析的字符串，如 "a=1&b=2"
 * @param key - 可选，指定要获取的参数名
 * @returns 如果指定了 key，返回对应的值；否则返回包含所有参数的对象
 *
 * @example
 * ```ts
 * // 解析整个字符串
 * parseParams("a=1&b=2"); // 返回 {a: "1", b: "2"}
 *
 * // 获取特定参数
 * parseParams("a=1&b=2", "a"); // 返回 "1"
 * ```
 */
export function parseParams(str?: string, key?: string): string | object {
  str = str || window.location.href
  str = decodeURIComponent(str)
  const reg = /(\w+)=([^&]+)/g
  let match = reg.exec(str)
  const reslut: { [key: string]: string } = {}
  while (match) {
    const key = match[1]
    const value = decodeURIComponent(match[2])
    reslut[key] = value
    match = reg.exec(str)
  }
  if (key) return reslut[key]
  else return reslut
}
/**
 * 对象解析成字符串入参
 *
 * 将对象转换为 URL 查询字符串格式
 *
 * @param params - 要转换的对象
 * @returns 格式化后的查询字符串
 *
 * @example
 * ```ts
 * paramsToQuery({a: 1, b: 2}); // 返回 "a=1&b=2"
 * paramsToQuery({name: "John Doe", age: 30}); // 返回 "name=John%20Doe&age=30"
 * ```
 */
export function paramsToQuery(obj: Record<string, string | number>): string {
  const array = Object.keys(obj).map((key) => `${key}=${encodeURIComponent(obj[key])}`)
  return array.join('&')
}
/**
 * 根据平台生成对应的跳转地址
 * @param {object} data - 入参
 * @param {string} data.platform - 平台类型 ALIPAY WECHAT BYTEDANCE JD
 * @param {string|number} data.appId - 平台appid
 * @param {string|number} data.miniType - 平台miniType
 * @param {string} data.page - 页面地址
 * @param {string} data.query - 全局参数
 * @param {string} data.envVersion - 小程序版本
 * @returns {string} - 生成的参数字符串
 */
export function generatePlatformLink(data: {
  platform: 'ALIPAY' | 'WECHAT' | 'BYTEDANCE' | 'JD'
  appId: string
  miniType?: string | number
  page?: string
  query?: string | Record<string, string | number>
  envVersion?: string
  jdType?: string
}): { scheme: string; https: string } {
  const result = {
    scheme: '',
    https: ''
  }
  const defaultQuery = data.query || {}
  const handlePageQuery = (value: string) => {
    const valueArr = value.split('?')
    const page = valueArr.shift()
    const query = valueArr.join('?')
    return {
      encodePage: `${page}${encodeURIComponent(query ? `?${query}` : '')}`,
      page,
      pageQuery: encodeURIComponent(query)
    }
  }
  if (typeof data.query === 'object') {
    data.query = encodeURIComponent(paramsToQuery(data.query))
  } else if (typeof data.query === 'string') {
    data.query = encodeURIComponent(data.query)
  }
  const pageObj = handlePageQuery(data.page || '')
  if (data.platform === 'ALIPAY') {
    const schemeUrl = 'alipays://platformapi/startapp'
    const httpsUrl = 'https://ds.alipay.com/'
    result.scheme = `${schemeUrl}?appId=${data.appId}${pageObj.encodePage ? `&page=${pageObj.encodePage}` : ''}${data.query ? `&query=${data.query}` : ''}`
    result.https = `${httpsUrl}?scheme=${encodeURIComponent(result.scheme)}`
  } else if (data.platform === 'WECHAT') {
    const schemeUrl = 'weixin://dl/business/'
    const httpsUrl = 'https://static.youpinhaoche.com/mini/to_schema.html'
    const wxQueryArray = []
    if (pageObj.pageQuery) wxQueryArray.push(pageObj.pageQuery)
    if (data.query) wxQueryArray.push(data.query)
    const wxQuery = wxQueryArray.join(encodeURIComponent('&'))
    result.scheme = `${schemeUrl}?appid=${data.appId}${pageObj.page ? `&path=${pageObj.page}` : '&path=pages/tabbar/dashboard/dashboard'}${wxQuery ? `&query=${wxQuery}` : ''}`
    result.https = `${httpsUrl}?miniType=${data.miniType}${pageObj.page ? `&path=${pageObj.page}` : ''}${wxQuery ? `&query=${wxQuery}` : ''}&envVersion=${data.envVersion || 'release'}`
  } else if (data.platform === 'BYTEDANCE') {
    const httpsUrl = 'https://static.youpinhaoche.com/mini/to_schema.html'
    const ttQueryArray = []
    if (pageObj.pageQuery) ttQueryArray.push(pageObj.pageQuery)
    if (data.query) ttQueryArray.push(data.query)
    let ttQuery = ttQueryArray.join(encodeURIComponent('&'))
    ttQuery = JSON.stringify(parseParams(ttQuery))
    result.https = `${httpsUrl}?miniType=${data.miniType}${pageObj.page ? `&path=${pageObj.page}` : ''}${ttQuery ? `&query=${ttQuery}` : ''}&envVersion=${data.envVersion || 'release'}`
  } else if (data.platform === 'JD') {
    const schemeUrl = 'openapp.jdmobile://virtual' // 默认打开京东商城
    const jdjrScheme = 'openjdjrapp://com.jd.jrapp/jdminiprogram/open'
    const httpsUrl = 'https://static.youpinhaoche.com/mini/to_schema.html' // 京东商城链接
    const schemeParams = {
      category: 'jump',
      des: 'jdmp',
      appId: data.appId || '',
      vapptype: data.envVersion && ['trial', 'develop'].includes(data.envVersion) ? 2 : 1,
      param: defaultQuery || '',
      path: data.page?.includes('?') ? `${data.page.replace('?', '.html?')}` : `${data.page}.html`
    }
    if (data.jdType === 'jdjr') {
      result.scheme = `${jdjrScheme}?jrparam=${JSON.stringify({ type: schemeParams })}&jrlogin=false&jrcontainer=native`
    } else {
      result.scheme = `${schemeUrl}?params=${JSON.stringify(schemeParams)}`
    }
    result.https = `${httpsUrl}?scheme=${encodeURIComponent(result.scheme)}`
  }
  return result
}
/**
 * 数组转换成selectOption适用的数组
 * @param {object} data - 入参
 * @param {object} data.list - 数组
 * @param {string} data.labelKey - label的key值
 * @param {string} data.valueKey - value的key值
 * @returns {array} - 生成的数组
 */
export function generateSelectOption(
  list: Record<string, unknown>[] = [],
  labelKey: string = 'label',
  valueKey: string = 'value'
): { label: unknown; value: unknown }[] {
  return list.map((item) => ({
    label: item[labelKey as keyof typeof item],
    value: item[valueKey as keyof typeof item]
  }))
}

/**
 * 查找对象数组中指定value的label值
 * @param {object} list - 数组
 * @param {string|number} value - 需要查找的值
 * @param {object} option - 配置项
 * @returns {unknown} - 返回的值
 */
export function findValueToLabel(
  list: Record<string, unknown>[] = [],
  value: string | number,
  option: {
    labelKey: string
    valueKey: string
    defaultValue: unknown
  } = {
    labelKey: 'label',
    valueKey: 'value',
    defaultValue: null
  }
): unknown {
  const result = list.find((item) => String(item[option.valueKey]) === String(value))
  return result ? result[option.labelKey] : option.defaultValue
}
/**
 * 防抖函数
 *
 * 创建一个防抖函数，延迟调用函数直到上次调用后的指定时间已经过去
 *
 * @param func - 要防抖的函数
 * @param wait - 延迟的毫秒数，默认为 200ms
 * @returns 防抖后的函数，带有 cancel 方法可以取消延迟的函数调用
 *
 * @example
 * ```ts
 * // 基本用法
 * const debouncedSearch = debounce((query) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * // 快速连续调用只会执行一次
 * debouncedSearch('a');
 * debouncedSearch('ap');
 * debouncedSearch('app'); // 只有这次会在 300ms 后执行
 *
 * // 取消待执行的调用
 * debouncedSearch.cancel();
 * ```
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 200
): {
  (...args: Parameters<T>): void
  cancel: () => void
} {
  let timeout: ReturnType<typeof setTimeout> | null = null
  function debounced(this: unknown, ...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
      timeout = null
    }, wait)
  }
  debounced.cancel = function () {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  return debounced
}
/**
 * 节流函数
 *
 * 创建一个节流函数，限制函数在给定的时间窗口内最多执行一次
 *
 * @param func - 要节流的函数
 * @param wait - 时间窗口的毫秒数，默认为 200ms
 * @returns 节流后的函数
 *
 * @example
 * ```ts
 * // 基本用法
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 300);
 *
 * // 添加到滚动事件
 * window.addEventListener('scroll', throttledScroll);
 *
 * // 即使快速滚动，每 300ms 最多执行一次
 * ```
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number = 200,
  options: { leading?: boolean; trailing?: boolean } = {}
): {
  (...args: Parameters<T>): ReturnType<T> | undefined
  cancel: () => void
} {
  let lastTime: number | null = null
  let timeout: ReturnType<typeof setTimeout> | null = null
  let result: ReturnType<T> | undefined
  const { leading = true, trailing = true } = options
  function cancel() {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    lastTime = null
  }
  const throttled = function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()

    if (!lastTime && !leading) {
      lastTime = now
    }
    const remaining = wait - (now - (lastTime || 0))
    if (remaining <= 0) {
      lastTime = now
      result = fn.apply(this, args) as ReturnType<T>
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        lastTime = leading ? Date.now() : 0
        timeout = null
        result = fn.apply(this, args) as ReturnType<T>
      }, remaining)
    }
    return result
  }
  throttled.cancel = cancel
  return throttled
}
/**
 * 深拷贝
 *
 * 创建一个值的深拷贝，支持对象、数组、日期等复杂数据类型
 *
 * @param obj - 要深拷贝的值
 * @returns 深拷贝后的值
 *
 * @example
 * ```ts
 * const original = {
 *   a: 1,
 *   b: { c: 2 },
 *   d: [1, 2, 3],
 *   e: new Date()
 * };
 *
 * const copy = deepClone(original);
 * copy.b.c = 3; // 不会影响 original.b.c
 * ```
 */
export function deepClone<T>(source: T, hash = new WeakMap()): T {
  // 处理null或非对象/数组的情况
  if (source === null || typeof source !== 'object') {
    return source
  }
  // 检查是否已经克隆过该对象
  if (hash.has(source as object)) {
    return hash.get(source as object) as T
  }
  // 处理日期对象
  if (source instanceof Date) {
    return new Date(source.getTime()) as T
  }
  // 处理数组
  if (Array.isArray(source)) {
    const cloneArr = [] as unknown[]
    hash.set(source, cloneArr)
    source.forEach((item) => {
      cloneArr.push(deepClone(item, hash))
    })
    return cloneArr as T
  }
  // 处理普通对象
  const cloneTarget = {} as { [key: string]: unknown }
  hash.set(source as object, cloneTarget)
  Object.keys(source).forEach((key) => {
    cloneTarget[key] = deepClone((source as { [key: string]: unknown })[key], hash)
  })
  return cloneTarget as T
}
/**
 * 生成唯一ID
 *
 * 生成一个随机的唯一标识符
 *
 * @returns 生成的唯一ID字符串
 *
 * @example
 * ```ts
 * const id1 = generateUID(); // 例如 "a1b2c3d4"
 * const id2 = generateUID(); // 不同的值，例如 "e5f6g7h8"
 * ```
 */
export function generateUID(length: number = 8): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random()
    .toString(36)
    .substring(2, length + 2)
  return `${timestamp}-${randomStr}`
}
/**
 * 下载文件
 *
 * 通过创建一个临时链接来下载文件
 *
 * @param url - 文件URL
 * @param filename - 可选，下载后的文件名
 *
 * @example
 * ```ts
 * // 下载图片
 * downloadFile('https://example.com/image.jpg', 'my-image.jpg');
 *
 * // 下载文件，使用原始文件名
 * downloadFile('https://example.com/document.pdf');
 * ```
 */
export function downloadFile(blob: Blob, fileName: string): void {
  try {
    // 对于 IE 浏览器使用 msSaveBlob
    if ('msSaveOrOpenBlob' in window.navigator) {
      ;(window.navigator as any).msSaveBlob(blob, fileName)
      return
    }
    // 创建下载链接
    const link = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    link.href = url
    link.download = fileName
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 清理创建的 URL 对象
    window.URL.revokeObjectURL(url)
  } catch (error) {
    throw new Error(`文件下载失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}
/**
 * 将 Data URL 转换为 Blob 对象
 *
 * 将 base64 编码的 Data URL 转换为 Blob 对象
 *
 * @param dataURL - 要转换的 Data URL 字符串
 * @returns 转换后的 Blob 对象
 *
 * @example
 * ```ts
 * // 将 canvas 转换为 blob
 * const canvas = document.createElement('canvas');
 * const dataURL = canvas.toDataURL('image/png');
 * const blob = dataURLtoBlob(dataURL);
 *
 * // 可以用于文件上传
 * const formData = new FormData();
 * formData.append('image', blob, 'image.png');
 * ```
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  try {
    const [header, base64Data] = dataUrl.split(',')
    const mimeMatch = header.match(/:(.*?);/)
    if (!mimeMatch) {
      throw new Error('无效的 Data URL 格式')
    }
    const mime = mimeMatch[1]
    const binaryString = window.atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return new Blob([bytes], { type: mime })
  } catch (error) {
    throw new Error(`转换 Data URL 到 Blob 失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 复制文本到剪贴板
 *
 * 将指定文本复制到系统剪贴板
 *
 * @param text - 要复制的文本
 * @returns Promise，成功时返回 true，失败时返回 false
 *
 * @example
 * ```ts
 * // 基本用法
 * copyText('Hello, world!').then(success => {
 *   if (success) {
 *     console.log('文本已复制到剪贴板');
 *   } else {
 *     console.error('复制失败');
 *   }
 * });
 *
 * // 在按钮点击事件中使用
 * button.addEventListener('click', () => {
 *   copyText('要复制的文本');
 * });
 * ```
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const textarea = document.createElement('textarea')
    textarea.style.opacity = '0'
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  } catch {
    return false
  }
}

/**
 * 获取图片尺寸
 *
 * 获取图片的宽度和高度
 *
 * @param url - 图片的 URL
 * @returns Promise，解析为包含宽度和高度的对象
 *
 * @example
 * ```ts
 * getImageDimensions('https://example.com/image.jpg')
 *   .then(dimensions => {
 *     console.log(`宽度: ${dimensions.width}, 高度: ${dimensions.height}`);
 *   })
 *   .catch(error => {
 *     console.error('获取图片尺寸失败:', error);
 *   });
 * ```
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('文件不是图片类型'))
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })
}

/**
 * 注册 DOM 元素到 body
 *
 * 将 DOM 元素添加到文档的 body 中
 *
 * @param dom - 要添加的 DOM 元素
 *
 * @example
 * ```ts
 * // 创建一个新元素并添加到 body
 * const div = document.createElement('div');
 * div.textContent = 'Hello, world!';
 * regBodyDom(div);
 * ```
 */
export function regBodyDom(html: string): string {
  const reg = /<body[^>]*>([\s\S]+?)<\/body>/i
  const result = reg.exec(html)
  return result ? result[1] : ''
}

/**
 * 格式化秒数为时分秒
 *
 * 将秒数转换为 HH:MM:SS 格式的时间字符串
 *
 * @param seconds - 要格式化的秒数
 * @returns 格式化后的时间字符串
 *
 * @example
 * ```ts
 * formatSeconds(3661); // 返回 "01:01:01"
 * formatSeconds(70);   // 返回 "00:01:10"
 * formatSeconds(0);    // 返回 "00:00:00"
 * ```
 */
export function formatSeconds(seconds: number = 0, format: string = 'HH:mm:ss'): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  const pad = (num: number): string => num.toString().padStart(2, '0')
  const result = format.replace(/HH/g, pad(hours)).replace(/mm/g, pad(minutes)).replace(/ss/g, pad(remainingSeconds))
  return result
}

/**
 * 判断值是否为空
 *
 * 检查一个值是否为 null、undefined、空字符串、空数组或空对象
 *
 * @param value - 要检查的值
 * @returns 如果值为空，返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isEmpty('');         // true
 * isEmpty(null);       // true
 * isEmpty(undefined);  // true
 * isEmpty([]);         // true
 * isEmpty({});         // true
 * isEmpty(0);          // false
 * isEmpty(false);      // false
 * isEmpty('0');        // false
 * ```
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  if (value instanceof Date) {
    return false
  }
  if (typeof value === 'object') {
    return Object.keys(value as object).length === 0
  }
  return false
}

/**
 * 设置水印
 *
 * 在页面上添加文字水印
 *
 * @param options - 水印选项
 * @param options.container - 水印容器，默认为 document.body
 * @param options.width - 水印宽度，默认为 300
 * @param options.height - 水印高度，默认为 200
 * @param options.textAlign - 文字对齐方式，默认为 'center'
 * @param options.textBaseline - 文字基线，默认为 'middle'
 * @param options.font - 字体样式，默认为 '14px Microsoft Yahei'
 * @param options.fillStyle - 填充样式，默认为 'rgba(184, 184, 184, 0.2)'
 * @param options.content - 水印内容，默认为 ''
 * @param options.rotate - 旋转角度，默认为 -20
 * @param options.zIndex - 层级，默认为 1000
 * @returns 水印 DOM 元素
 *
 * @example
 * ```ts
 * // 基本用法
 * setWaterMark({
 *   content: '机密文件',
 *   fillStyle: 'rgba(200, 100, 100, 0.2)'
 * });
 *
 * // 自定义容器
 * const container = document.getElementById('my-container');
 * setWaterMark({
 *   container,
 *   content: '仅供内部使用',
 *   rotate: -30
 * });
 * ```
 */
export function setWaterMark(str: string) {
  if (isEmpty(str)) return
  const dom = document.getElementById('waterMarkContent')
  if (dom) document.body.removeChild(dom)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('浏览器不支持canvas')
    return
  }
  canvas.width = 250
  canvas.height = 180
  ctx.font = '100 14px "PingFangSC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif'
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.textAlign = 'center'
  const maxWidth = 160
  const textLines: string[] = []
  let currentLine = ''
  for (const char of str) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine) {
      textLines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  textLines.push(currentLine)
  ctx.save()
  ctx.rotate((-45 * Math.PI) / 180)
  const baseHeight = (4 - textLines.length) * 35 + 70
  textLines.forEach((line, index) => {
    const x = 25 - textLines.length * 5
    const y = 21 * index + baseHeight
    ctx.fillText(line, x, y, maxWidth)
  })
  ctx.restore()
  const watermark = document.createElement('div')
  watermark.id = 'waterMarkContent'
  Object.assign(watermark.style, {
    pointerEvents: 'none',
    position: 'fixed',
    top: '0',
    left: '200px',
    right: '0',
    bottom: '0',
    zIndex: '999999',
    backgroundImage: `url(${canvas.toDataURL('image/png')})`,
    backgroundRepeat: 'repeat'
  })
  document.body.appendChild(watermark)
}

/**
 * 验证身份证号
 *
 * 检查字符串是否为有效的中国身份证号码（支持15位和18位）
 *
 * @param id - 要验证的身份证号码
 * @returns 如果是有效的身份证号，返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isIdCard('110101199001011234'); // 根据实际规则返回 true 或 false
 * isIdCard('11010119900101123');  // false，长度不正确
 * ```
 */
export function isIdCard(idCard: string): boolean {
  // 基础正则校验
  const regex =
    /^[1-9]\d{5}(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}|(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx])$/
  if (!regex.test(idCard)) {
    return false
  }
  return true
}
/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} - 返回是否为有效的手机号
 */
export function isPhone(phone: string): boolean {
  // 手机号正则校验
  const regex = /^1[3-9]\d{9}$/
  return regex.test(phone)
}
/**
 * 数据脱敏
 * @param {string} value - 需要脱敏的值
 * @param {Object} options - 脱敏配置项
 * @param {number} options.start - 起始保留长度
 * @param {number} options.end - 结尾保留长度
 * @param {string} options.mask - 掩码字符
 * @param {'phone'|'email'|'name'|'idcard'} options.type - 脱敏类型
 * @returns {string} - 返回脱敏后的字符串
 */
export function desensitize(
  value: string,
  options?: {
    start?: number
    end?: number
    mask?: string
    count?: number
    type?: 'phone' | 'email' | 'name' | 'idcard'
  }
): string | null | undefined {
  if (!value) return value
  if (typeof value !== 'string') return value
  if (options?.type === undefined) return value

  const defaultOptions = {
    start: options?.type === 'name' ? 1 : 3,
    end: options?.type === 'name' ? 0 : 4,
    mask: '*',
    type: 'phone',
    count: options?.type === 'name' ? 1 : 4
  } as const

  const mergedOptions = { ...defaultOptions, ...options }
  const { start, end, mask, count } = mergedOptions
  if (value.length <= start + end) return value
  switch (mergedOptions.type) {
    case 'phone': {
      const startStr = value.substring(0, start)
      const endStr = value.substring(value.length - end)
      const maskStr = mask.repeat(count)
      return startStr + maskStr + endStr
    }
    case 'idcard': {
      const valueLength = value.length
      const startStr = value.substring(0, start)
      const endStr = value.substring(valueLength - end)
      const maskStr = mask.repeat(valueLength - startStr.length - endStr.length)
      return startStr + maskStr + endStr
    }
    case 'email': {
      if (!value.includes('@')) return value
      if (value.indexOf('@') === 0 || value.indexOf('@') === value.length - 1) return value
      const atIndex = value.split('@')
      if (!options.end) {
        return atIndex[0].substring(0, start) + mask.repeat(count) + '@' + atIndex[1]
      } else {
        const startStr = atIndex[0].substring(0, start)
        const endStr = value.substring(value.length - end)
        const maskStr = mask.repeat(count)
        return startStr + maskStr + endStr
      }
    }
    case 'name': {
      const startStr = value.substring(0, 1)
      const endStr = value.substring(value.length - 1)
      if (value.length <= 2) {
        return startStr + '*'
      }
      const maskStr = mask.repeat(value.length - 2)
      return startStr + maskStr + endStr
    }
    default:
      return value
  }
}

/**
 * 解析 scheme 地址
 *
 * 将 scheme 地址解析为路径和参数对象
 *
 * @param scheme - 要解析的 scheme 地址
 * @returns 包含路径和参数的对象
 *
 * @example
 * ```ts
 * schemeToParams('myapp://path/to/page?id=123&name=test');
 * // 返回 { path: 'path/to/page', params: { id: '123', name: 'test' } }
 * ```
 */
export function schemeToParams(scheme: string): {
  params?: { appId?: string; path?: string; query?: Record<string, string> }
  message?: string
} {
  // 如果 scheme 不是以 'alipays:' 开头，返回错误消息
  if (!scheme.startsWith('alipays:')) {
    return { message: '! 非 alipays: 开头' }
  }
  const params: { appId?: string; path?: string; query?: Record<string, string> } = {}
  // 用于解析查询字符串的辅助函数
  const parseQuery = (str: string): Array<[string, string]> => {
    return str
      .replace(/^.*?\?/, '')
      .split('&')
      .map((s) => {
        const p = s.includes('=') ? s.indexOf('=') : s.length
        return [s.slice(0, p), s.slice(p + 1)].map(decodeURIComponent) as [string, string]
      })
  }

  // 解析 scheme 中的查询参数
  for (const [k, v] of parseQuery(scheme)) {
    if (k === 'appId') {
      // 验证 appId 是否为 16 位
      if (v.length !== 16) {
        return { message: `! 非 16 位 appId '${v}'` }
      }
      params[k] = v
    } else if (k === 'page') {
      // 将 'page' 转换为 'path'
      params.path = v
    } else if (k === 'query') {
      // 解析 query 参数为对象
      const queryParams: Record<string, string> = {}
      for (const [x, y] of parseQuery(v)) {
        if (y) {
          queryParams[x] = y
        }
      }
      params.query = queryParams
    } else {
      // 如果参数不被支持，返回错误消息
      return { message: `! 不支持参数 '${k}'` }
    }
  }
  // 返回解析后的参数
  return { params }
}
/**
 * 获取 URL 参数
 *
 * 解析 URL 中的查询参数
 *
 * @param url - 要解析的 URL
 * @returns 包含所有参数的对象
 *
 * @example
 * ```ts
 * getURLParameters('https://example.com?name=John&age=30');
 * // 返回 { name: 'John', age: '30' }
 * ```
 */
export function getURLParameters(url: string): Record<string, string> {
  try {
    const params: Record<string, string> = {}
    const urlParts = url.split('?')

    if (urlParts.length > 1) {
      const queryString = urlParts[1]
      const paramPairs = queryString.split('&')
      paramPairs.forEach((pair) => {
        const [key, value] = pair.split('=')
        if (key && value !== undefined) {
          params[key] = decodeURIComponent(value)
        }
      })
    }
    return params
  } catch (error) {
    console.error('Error occurred while getting URL parameters:', error)
    return {}
  }
}
/**
 * 生成支付宝小程序长链接
 *
 * 生成支付宝小程序的长链接
 *
 * @param options - 链接选项
 * @param options.appId - 小程序 appId
 * @param options.page - 页面路径
 * @param options.query - 查询参数
 * @returns 生成的长链接
 *
 * @example
 * ```ts
 * generateAlipayLongLink({
 *   appId: '2021000000000000',
 *   page: 'pages/index/index',
 *   query: { id: '123' }
 * });
 * // 返回 "https://..."
 * ```
 */
export function generateAlipayLongLink(alipays: string): string | { message: string } {
  if (alipays.startsWith('alipays:')) {
    return `https://render.alipay.com/p/s/i/?scheme=${encodeURIComponent(alipays)}`
  } else {
    return { message: '! 非 alipays: 开头' }
  }
}
/**
 * 生成支付宝小程序 scheme
 *
 * 生成可以直接打开支付宝小程序的 scheme
 *
 * @param options - scheme 选项
 * @param options.appId - 小程序 appId
 * @param options.page - 页面路径
 * @param options.query - 查询参数
 * @returns 生成的 scheme
 *
 * @example
 * ```ts
 * generateAlipayScheme({
 *   appId: '2021000000000000',
 *   page: 'pages/index/index',
 *   query: { id: '123' }
 * });
 * // 返回 "alipays://..."
 * ```
 */
export function generateAlipayScheme({
  appId,
  page,
  pageQuery = {},
  globalQuery = {}
}: {
  appId: string
  page: string
  pageQuery?: Record<string, string | number>
  globalQuery?: Record<string, string | number>
}): {
  fullScheme: string
  longLink: string | { message: string }
} {
  const baseScheme = 'alipays://platformapi/startapp'
  let fullScheme = `${baseScheme}?appId=${appId}&page=${page}`

  if (!isEmpty(pageQuery)) {
    fullScheme += encodeURIComponent(`?${paramsToQuery(pageQuery)}`)
  }

  if (!isEmpty(globalQuery)) {
    fullScheme += `&query=${encodeURIComponent(paramsToQuery(globalQuery))}`
  }
  const longLink = generateAlipayLongLink(fullScheme)

  return {
    fullScheme,
    longLink
  }
}
/**
 * 过滤对象中的无效值
 *
 * 过滤对象数据中的 undefined、null 和空字符串
 *
 * @param obj - 要过滤的对象
 * @returns 过滤后的对象
 *
 * @example
 * ```ts
 * filterInvalidValues({
 *   name: 'John',
 *   age: 30,
 *   email: '',
 *   phone: null,
 *   address: undefined
 * });
 * // 返回 { name: 'John', age: 30 }
 * ```
 */
export function filterInvalidValues(obj: Record<string, unknown>): Record<string, unknown> {
  const filteredObj: Record<string, unknown> = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value !== undefined && value !== null && value !== '') {
      filteredObj[key] = value
    }
  })
  return filteredObj
}
/**
 * 验证姓名是否合法
 *
 * 姓名可以是中文或英文，并且符合以下规则：
 * - 中文姓名：以一个汉字开头，后面可以跟随 0 到 18 个汉字、点、· 或 。，最后一个字符必须是汉字
 * - 英文姓名：以一个字母开头，后面可以跟随 0 到 18 个字母或空格，最后一个字符必须是字母
 *
 * @param name - 要验证的姓名
 * @returns 如果姓名符合规则，返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isTrueName('张三');      // true
 * isTrueName('John Doe');  // true
 * isTrueName('123');       // false
 * isTrueName('');          // false
 * ```
 */
export function isTrueName(name: string): boolean {
  // 检查 name 是否为 null、undefined 或非字符串类型
  if (name === null || name === undefined || typeof name !== 'string') {
    return false
  }
  const reg =
    /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5.·。]{0,18}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,18}[a-zA-Z]{1}$)/

  return reg.test(name) // 使用正则表达式验证姓名是否符合规则
}
