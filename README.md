# vue-sample Instuctions

## 说明

[由浅入深理解Vue中的通信方法](https://www.toryang.top/archives/77)

该Vue Project当前为组件间通信提供代码例子：

主要代码示例：

### 父子组件间的通信

* 父组件向子组件传递数据：使用props进行数据传递；
* 父组件调用子组件的方法：用子组件的`ref`引用来调用子组件的方法；
* 子组件向父组件传递数据：子组件通过`this.$emit()`的方式将值传递给父组件；
* 子组件调用父组件的方法：有三种方法
    * 与（3）相同，使用`this.$emit()`的方式进行方法调用；
    * 使用props的方式，传function的值；
    * 在子组件使用 `this.$parent`的方式调用父组件方法；


### 非父子组件间的通信

非父子组件间的通信有两种方式：
1. Vue Bus总线
2. Vuex

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```