<template>

  <div class="logo">
    Ashy's Palia Fish Search
  </div>
  
  <div class="searcher">
    <input type="text" placeholder="Start typing a fish name, zone, rarity, time or bait" v-model="this.$store.state.searchTerm" @keyup="filterFish()"/>
  </div>

  <div class="wrapper">

    <div 
    v-for="fish in $store.state.filterFish" 
    :key="fish.fish_id" 
    class="fish" 
    :checked="fish.checked"
    @click="selectFish(fish)"
    >
      <div class="zone">{{ fish.fish_zone }}</div>
      <span nm>{{ fish.fish_name }}</span>
      <img :src="fish.fish_img" alt="">
      <div class="details">
 
        <span>Bait: <span>{{ fish.fish_bait }}</span></span>
        <span>Sold for: <span>{{ fish.fish_gold }}</span></span>
        <span>Rarity: <span>{{ fish.fish_rarity }}</span></span>
        <span>Time: <span>{{ fish.fish_time }}</span></span>
      </div>
    </div>

  </div>


</template>

<script>

import axios from 'axios';
import { pushScopeId } from 'vue';

export default {
mounted(){
  this.loadFishes();
},
methods:{
  async loadFishes(){
    await axios.post("https://ashypls.com/endpoints/puzzler.asmx/createFishList",{
      contentType:'application/json'
    }).then(response =>{
      this.$store.state.fishes = JSON.parse(response.data.d);
      this.$store.state.filterFish = this.$store.state.fishes;
    })
  },
  filterFish(){
    this.$store.state.filterFish = [];

    this.$store.state.fishes.forEach(fish =>{
      let pushFish = false;


      if (fish.fish_name.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase())){
        pushFish = true;
      }
      if (fish.fish_bait.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase())){
        pushFish = true;
      }
      if (fish.fish_time.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase())){
        pushFish = true;
      }
      if (fish.fish_zone.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase())){
        pushFish = true;
      }
      if (fish.fish_rarity.toLowerCase().includes(this.$store.state.searchTerm.toLowerCase())){
        pushFish = true;
      }



      if(pushFish){this.$store.state.filterFish.push(fish);}

    });



  },
  async selectFish(fish){
    fish.checked = !fish.checked;
    console.log(this.$store.state.fishes)
    //sync the fishes
    await axios.post("https://ashypls.com/endpoints/puzzler.asmx/updateFishList",{
      contentType:'application/json',
      fishes: JSON.stringify(this.$store.state.fishes)
    }).then(
      response =>{
        //console.log(response.data.d);
      }
    )
  }
}
}
</script>

<style lang="scss" scoped>
.wrapper{
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap:1rem;
  padding:1rem;
  justify-content: center;

  .fish{

    position:relative;
    background:#34405a;
    border-radius: 1rem;
    display:flex;
    flex-direction: column;
    min-width:400px;
    border:solid 5px #10234d;
    overflow: hidden;
    gap:.5rem;
    user-select: none;
    cursor: pointer;

    &[checked="true"]{
      border-color:#3aa948;
      .zone{
        background:#3aa948;
      }
    }

    &:hover{
      border-color:#091736
    }
    

    .zone{
      background:#10234d;
      text-align: center;
      font-size:120%;
      padding:.5rem;
      color:white;
    }

    &[checked="true"]{
      border-color:#3aa948;
      .zone{
        background:#3aa948;
      }
    }

    img{
    width:100px;
    aspect-ratio: 1;
    object-fit: contain;
    border:solid 3px #34405a;
    position: absolute;
    left:10px;
    bottom:0;
    transform:translateY(-50px);
  }
  span{
      &[nm]{
        font-size: 150%;
        color:#fdff9e;
        text-align: center;
        justify-content: center;
        width:100%;
        flex-grow: 1;
      }
    }

  .details{
    display:flex;
    flex-direction: column;
    gap:0.5rem;
    color:white;
    margin-left:120px;
    width:calc(100% - 10rem);
    padding:1rem;

    span{
      display:flex;
      justify-content: space-between;
      color:white;
      span{
        color:#f7b901;
      }
    }
  }

  }


}

.searcher{
  display:flex;
  justify-content: center;
  align-items: center;
  padding:2rem;
  width:100%;

  input{
    width:100%;
    max-width: 600px;
    font-size: 120%;
    padding:1rem;
    background:#10234d;
    color:white;
    border-radius: 1rem;
    outline:none;
    border:solid 5px #34405a;
  }
}
.logo{
  display:flex;
  justify-content: center;
  align-items: center;
  padding-top:2rem;
  width:100%;
  font-size:200%;
  color:white;
  }
</style>