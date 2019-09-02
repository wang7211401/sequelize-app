<template>
    <div>
        <div class="mb">
            <div class="list" v-for="content of contents" :key="content.id">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{content.username}}</h5>
                    <small>{{content.created_at}}</small>
                </div>
                <p class="mb-1 ml">
                    {{content.title}}
                </p>
                <p class="mb-1 ml">
                    {{content.content}}
                </p>
                <footer class="text-right">
                    <small @click="like(content.id)">赞（{{content.like_count}}）</small>
                    <small>回复（{{content.comment_count}}）</small>
                    <a href="" @click.prevent="replyToggle(content.id)">我要回复</a>
                </footer>
                
                <div class="list" v-for="item in content.comments" :key="item.id">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">{{item.username}}</h5>
                        <small>{{item.created_at}}</small>
                    </div>
                    <p class="mb-1 ml">
                        {{item.content}}
                    </p>
                </div>
            </div>
        </div>

        <div class="mb">
            <ul class="pagination mb">
                <li class="page-item"
                    :class="{disabled:page == 1}"
                    @click="getData(Math.max(1,page-1))">
                    <span class="page-link"> &lt; </span>
                </li>
                <li class="page-item" 
                    v-for="p in pages"
                    :key="p"
                    :class="{active:p == page}"
                    @click="getData(p)">
                    <span class="page-link">{{p}}</span>
                </li>
                <li class="page-item"
                    :class="{disabled:page == pages}"
                    @click="getData(Math.min(pages,page+1))">
                    <span class="page-link"> &gt; </span>
                </li>
            </ul>
        </div>

         <modal title="回复" :show="modalName == 'reply'" @close="toggle">
            <form>
                <div class="form-group row">
                    <div class="col-md-12">
                        <textarea class="form-control" id="reply_username" placeholder="回复内容……" cols="30" rows="10" v-model="reply.content"></textarea>
                    </div>
                </div>
            </form>

            <template slot="footer">
                <button type="button" class="btn btn-primary" @click="replySubmit">回复</button>
                <button type="button" class="btn btn-secondary" @click="toggle">取消</button>
            </template>
        </modal>
    </div>
</template>

<script>
import axios from 'axios'
import Modal from './modal/Modal'

export default {
    data() {
        return {
            page:1, // 当前页
            prepage:3, // 每页显示的记录条数
            pages:1, // 总页数
            count: 0,
            contents: [],
            modalName:'',
            reply:{
                content:'',
                content_id:''
            }
        }
    },
    components:{
        Modal
    },
    created() {
       this.getData()
    },
    methods:{
        getData(p){
            if(p == this.page) return 

            this.page = p || this.page

            axios({
                method: 'get',
                url: '/api/',
                params:{
                    page:this.page,
                    prepage:this.prepage
                }
            }).then( rs => {
                if (!rs.code) {
                    this.count = rs.data.count;
                    this.contents = rs.data.data;
                    this.prepage = rs.data.prepage
                    this.pages = Math.ceil(this.count / this.prepage)
                }
            });
        },
        replySubmit(){
            if(this.reply_content == ""){
                alert('内容不能为空！')
            }
            axios({
                method:'post',
                url:'/api/reply',
                data:this.reply
            }).then(({data})=>{
                if(data.code == 0){
                    alert(data.msg);
                    location.href="/"
                }else{
                    alert(data.msg)
                }
            })
        },
        replyToggle(contentId){
            this.modalName = 'reply'
            this.reply.content_id = contentId
        },
        toggle(name){
            name = name || ""
            this.modalName = name
            this.reply.content_id = ''
        },
        like(contentId){
            axios({
                method:'post',
                url:'/api/like',
                data:{
                    content_id:contentId
                }
            }).then(({data})=>{
                if(data.code == 0){
                    alert(data.msg);

                    this.contents.forEach(item =>{
                        if(item.id === contentId){
                            item.like_count = data.data.like_count
                        }
                    })
                }else{
                    alert(data.msg)
                }
            })
        }
    }
}
</script>
