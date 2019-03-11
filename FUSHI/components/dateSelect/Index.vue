<template lang="html">
  <section class="sufan-selects">
    <div class="date-select">
        <Select v-model="select" @on-change="doOnChange">
           <Option value="year">年</Option>
           <Option value="quarter">季</Option>
           <Option value="month">月</Option>
           <Option value="date">日</Option>
         </Select>
    </div>
    <div class="date-select-time" :class="{'times-last': check}">
      <DatePicker v-model="date" format="yyyy" type="year" style="width: 200px" v-if="select === 'year'" @on-open-change="doOpenChange"></DatePicker>
      <DatePicker v-model="date" format="yyyy" type="year" style="width: 200px" v-if="select === 'quarter'" @on-open-change="doOpenChange"></DatePicker>
      <DatePicker v-model="date" format="yyyy-MM" type="month" style="width: 200px" v-if="select === 'month'" @on-open-change="doOpenChange"></DatePicker>
      <DatePicker v-model="date" format="yyyy-MM-dd" type="date" style="width: 200px" v-if="select === 'date'" @on-open-change="doOpenChange"></DatePicker>
    </div>
    <div class="date-select-time" v-if="select === 'quarter'" :class="{'times-last': checkone}">
    <Select v-model="quarterData" @on-change="ckeckSelect" style="width:100px">
        <Option v-for="item in cityList" :value="item.key" :key="item.key">{{ item.month }}</Option>
    </Select>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      check: false,
      checkone: false,
      select: 'year',
      quarterData: 1,
      cityList: [{
        month: '第一季度',
        key: 1
      }, {
        month: '第二季度',
        key: 2
      }, {
        month: '第三季度',
        key: 3
      }, {
        month: '第四季度',
        key: 4
      }],
      dateValue: '',
      date: new Date()
    }
  },
  methods: {
    doOnChange(val) {},
    ckeckSelect() {
      let year = this.date.getFullYear()
      let values = `${year}-0${this.quarterData}`
      this.$emit('input', {
        type: 'quarter',
        data: values
      })
    },
    // 触发连级选择
    doOpenChange(val) {
      if (val) {
        this.check = true
        this.checkone = false
      } else {
        this.check = false
      }
    }
  },
  watch: {
    date: {
      immediate: true,
      handler(val) {
        console.log(val)
        if (!val) {
          return this.$emit('input', '')
        }
        let year = val.getFullYear()
        let month = val.getMonth()
        let date = val.getDate()
        switch (this.select) {
          case 'year':
            this.dateValue = `${year}`
            this.$emit('input', {
              type: 'year',
              data: this.dateValue
            })
            break
          case 'quarter':
            this.dateValue = `${year}-0${this.quarterData}`
            this.$emit('input', {
              type: 'quarter',
              data: this.dateValue
            })
            break
          case 'month':
            if (month < 10) {
              this.dateValue = `${year}-0${month + 1}`
            } else {
              this.dateValue = `${year}-${month + 1}`
            }
            this.$emit('input', {
              type: 'month',
              data: this.dateValue
            })
            break
          case 'date':
            if (month < 10) {
              this.dateValue = `${year}-0${month + 1}-${date}`
            } else {
              this.dateValue = `${year}-${month + 1}-${date}`
            }
            if (date < 10) {
              this.dateValue = `${year}-${month + 1}-0${date}`
            } else {
              this.dateValue = `${year}-${month + 1}-${date}`
            }
            this.$emit('input', {
              type: 'date',
              data: this.dateValue
            })
            break
          default:
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.sufan-selects {
    display: flex;
    display: -webkit-flex;
    display: -ms-flex;
    .date-select {
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        z-index: 8;
    }
    .date-select-time {
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        margin-left: -1px;
    }
    .times-last {
        z-index: 9 !important;
    }
}
</style>
