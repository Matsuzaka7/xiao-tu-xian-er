<template>
  <div class="goods-comment">
    <!-- 评价头部 -->
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item, index) in commentInfo.tags" :key="item.title" href="javascript:;"
            :class="{ active: currentTagIndex === index }" @click="changeTag(index)">{{ item.title }}（{{ item.tagCount
            }}）</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a @click="changeSort(null)" :class="{ active: reqParams.sortField === null }" href="javascript:;">默认</a>
      <a @click="changeSort('praiseCount')" :class="{ active: reqParams.sortField === 'praiseCount' }"
        href="javascript:;">最新</a>
      <a @click="changeSort('crateTime')" :class="{ active: reqParams.sortField === 'crateTime' }"
        href="javascript:;">最热</a>
    </div>
    <!-- 评价列表 -->
    <div class="list" v-if="commentList.length">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="item in item.score" :key="i+'s'" class="iconfont icon-wjx01"></i>
            <i v-for="item in 5 - item.score" :key="i+'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 评论图片 -->
          <GoodsCommentImage v-if="item.pictures.length" :pictures="item.pictures"></GoodsCommentImage>
          <div class="time">
            <span>{{item.crateTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 没有数据时展示的模板 -->
    <div class="list" v-else>
      <div class="item" v-for="item in 5">
        <div class="user">
          <img src="http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/avatar_1.png" alt="">
          <span>兔****m</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx01"></i>
            <i class="iconfont icon-wjx02"></i>
            <span class="attr">颜色：黑色 尺码：M</span>
          </div>
          <div class="text">网易云app上这款耳机非常不错 新人下载网易云购买这款耳机优惠大 而且耳机🎧确实正品 音质特别好 戴上这款耳机 听音乐看电影效果声音真是太棒了 无线方便 小盒自动充电
            最主要是质量好音质棒 想要买耳机的放心拍 音效巴巴滴 老棒了</div>
          <GoodsCommentImage :pictures="['http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-05/6fdcac19-dd44-442c-9212-f7ec3cf3ed18.jpg', 'http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-05/45fd1372-05d2-4ff8-8669-79463a1e589f.jpg']"></GoodsCommentImage>
          <div class="time">
            <span>2020-10-10 10:11:22</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>100</span>
          </div>
        </div>
      </div>
      <div class="head" style="justify-content: center;">暂无数据, 以上为效果样式</div>
    </div>
    <!-- 分页组件 -->
    <!-- <XtxPagination :total="total" :pageSize="reqParams.pageSize" :currentPage="reqParams.page"></XtxPagination> -->
    <!-- 由于没有数据，因此写死的页码 -->
    <XtxPagination :total="100" :pageSize="10" :currentPage="2" @currentPage="changePagerFn"></XtxPagination>
  </div>
</template>
<script>
import { ref, reactive, inject, watch } from 'vue'
import { findGoodsCommentInfo, findGoodsCommentList } from '@/api/product'
import GoodsCommentImage from './goods-comment-image.vue'
import XtxPagination from '@/components/library/xtx-pagination.vue';
export default {
    name: "GoodsComment",
    setup() {
        // 获取评价信息
        const commentInfo = ref(null);
        const goods = inject("goods");
        findGoodsCommentInfo(goods.value.id).then(data => {
            // 设置数据之前，应该先添加全部评价
            data.result.tags.unshift({ title: "有图", tagCount: data.result.hasPictureCount, type: "img" });
            data.result.tags.unshift({ title: "全部评价", tagCount: data.result.evaluateCount, type: "all" });
            commentInfo.value = data.result;
        });
        // 激活tag后 修改 reqParams.tag 数据
        const currentTagIndex = ref(0);
        const changeTag = (i) => {
            currentTagIndex.value = i;
            // 修改 reqParams 数据
            const tag = commentInfo.value.tags[i];
            // 情况一：全部评价
            if (tag.type === "all") {
                reqParams.hasPicture = false;
                reqParams.tag = null;
                // 情况二：有图
            }
            else if (tag.type === "img") {
                reqParams.hasPicture = true;
                reqParams.tag = null;
                // 情况三：正常tag
            }
            else {
                reqParams.hasPicture = false;
                reqParams.tag = tag.title;
            }
            // 每次修改后页数重置回 1
            reqParams.page = 1;
        };
        // 准备筛选条件
        const reqParams = reactive({
            page: 1,
            pageSize: 10,
            hasPicture: null,
            tag: null,
            // sortField可选字段：praiseCount(热度), crateTime(最新)
            sortField: null
        });
        // 点击排序
        const changeSort = (sortField) => {
            reqParams.sortField = sortField;
            reqParams.page = 1;
        };
        // 初始化时发请求，筛选条件发请求
        const commentList = ref([]);
        const total = ref(0)
        watch(reqParams, () => {
            findGoodsCommentList(goods.value.id, reqParams).then(data => {
                commentList.value = data.result.items;
                total.value = data.result.counts
            });
        }, { immediate: true });
        // 定义转换数据的函数
        const formatSpecs = (specs) => {
            return specs.reduce((p, c) => `${p} ${c.name}: ${c.nameValue}`, "").trim();
        };
        // 格式化名字 '我是张三' => '我**三'
        const formatNickname = (nickname) => {
            return nickname.substr(0, 1) + "****" + nickname.substr(-1);
        };
        // 分页切换
        const changePagerFn = (newPage) => {
          reqParams.page = newPage
        }
        return { commentInfo, currentTagIndex, changeTag, reqParams, commentList, changeSort, formatSpecs, formatNickname, total, changePagerFn };
    },
    components: { GoodsCommentImage, XtxPagination }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;

    .data {
      width: 340px;
      display: flex;
      padding: 20px;

      p {
        flex: 1;
        text-align: center;

        span {
          display: block;

          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }

          &:last-child {
            color: #999;
          }
        }
      }
    }

    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;

      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }

      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        >a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;

          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }

          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }

  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;

    >span {
      margin-left: 20px;
    }

    >a {
      margin-left: 30px;

      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
}

.list {
  padding: 0 20px;

  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;

    .user {
      width: 160px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }

      span {
        padding-left: 10px;
        color: #666;
      }
    }

    .body {
      flex: 1;

      .score {
        line-height: 40px;

        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }

        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }

    .text {
      color: #666;
      line-height: 24px;
    }

    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}
</style>
