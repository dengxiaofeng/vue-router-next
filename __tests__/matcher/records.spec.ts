import { normalizeRouteRecord } from '../../src/matcher'

describe('normalizeRouteRecord', () => {
  it('transforms a single view into multiple views', () => {
    const record = normalizeRouteRecord({
      path: '/home',
      component: {},
    })
    expect(record).toEqual({
      beforeEnter: undefined,
      children: [],
      aliasOf: undefined,
      components: { default: {} },
      leaveGuards: [],
      instances: {},
      meta: {},
      name: undefined,
      path: '/home',
      props: false,
    })
  })

  it('keeps original values in single view', () => {
    const beforeEnter = jest.fn()
    const record = normalizeRouteRecord({
      path: '/home',
      beforeEnter,
      children: [{ path: '/child' } as any],
      meta: { foo: true },
      name: 'name',
      component: {},
    })
    expect(record).toEqual({
      beforeEnter,
      children: [{ path: '/child' }],
      components: { default: {} },
      leaveGuards: [],
      instances: {},
      meta: { foo: true },
      name: 'name',
      path: '/home',
      props: false,
    })
  })

  it('keeps original values in redirect', () => {
    const record = normalizeRouteRecord({
      path: '/redirect',
      redirect: '/home',
      meta: { foo: true },
      name: 'name',
    })

    expect(record).toEqual({
      beforeEnter: expect.any(Function),
      children: [],
      aliasOf: undefined,
      components: {},
      leaveGuards: [],
      instances: {},
      meta: { foo: true },
      name: 'name',
      path: '/redirect',
      props: false,
    })
  })

  it('keeps original values in multiple views', () => {
    const beforeEnter = jest.fn()
    const record = normalizeRouteRecord({
      path: '/home',
      beforeEnter,
      children: [{ path: '/child' } as any],
      meta: { foo: true },
      name: 'name',
      components: { one: {} },
    })
    expect(record).toEqual({
      beforeEnter,
      children: [{ path: '/child' }],
      components: { one: {} },
      leaveGuards: [],
      instances: {},
      meta: { foo: true },
      name: 'name',
      path: '/home',
      props: false,
    })
  })

  it('transforms a redirect record into a beforeEnter guard', () => {
    const record = normalizeRouteRecord({
      path: '/redirect',
      redirect: '/home',
    })
    expect(record).toEqual({
      beforeEnter: expect.any(Function),
      children: [],
      aliasOf: undefined,
      components: {},
      leaveGuards: [],
      instances: {},
      meta: {},
      name: undefined,
      path: '/redirect',
      props: false,
    })
  })

  it('beforeEnter is called with the string redirect', () => {
    const record = normalizeRouteRecord({
      path: '/redirect',
      redirect: '/home',
    })

    let spy = jest.fn()
    ;(record.beforeEnter as Function)({} as any, {} as any, spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/home')
  })

  it('beforeEnter is called with object redirect', () => {
    const record = normalizeRouteRecord({
      path: '/redirect',
      redirect: { name: 'home' },
    })

    let spy = jest.fn()
    ;(record.beforeEnter as Function)({} as any, {} as any, spy)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ name: 'home' })
  })

  it('function redirect is invoked by beforeEnter', () => {
    const redirect = jest.fn(() => '/home')
    const record = normalizeRouteRecord({
      path: '/redirect',
      redirect,
    })

    let spy = jest.fn()
    ;(record.beforeEnter as Function)(
      { path: '/redirect' } as any,
      {} as any,
      spy
    )
    expect(redirect).toHaveBeenCalledTimes(1)
    expect(redirect).toHaveBeenCalledWith({ path: '/redirect' })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/home')
  })
})
