<template>
  <div
    @click="this.$store.state.completed = false"
    v-if="this.$store.state.completed"
    class="completed"
  >
    <span
      >🐟🐟🐟<br /><br />Yay, you got them all! Well done!
      <br /><br />🐟🐟🐟</span
    >
  </div>

  <div class="logo">
    <img src="../assets/logo.png" />
  </div>

  <div class="searcher">
    <div class="search-box">
      <input
        id="inpsearch"
        type="text"
        placeholder="Start typing a fish name, zone, rarity, time or bait"
        v-model="this.$store.state.searchTerm"
        @keyup="filterFish()"
      />
    </div>
    <div class="checker">
      <button
        :selected="this.$store.state.mode == 'all'"
        @click="
          this.$store.state.mode = 'all';
          filterFish();
        "
      >
        Show All
      </button>
      <button
        :selected="this.$store.state.mode == 'checked'"
        @click="
          this.$store.state.mode = 'checked';
          filterFish();
        "
      >
        Show Checked
      </button>
      <button
        :selected="this.$store.state.mode == 'unchecked'"
        @click="
          this.$store.state.mode = 'unchecked';
          filterFish();
        "
      >
        Show Unchecked
      </button>
    </div>
  </div>

  <div v-if="!this.$store.state.appLoaded" class="wrapper loader">
    Loading Fishes one sec..
  </div>

  <div v-if="this.$store.state.appLoaded" class="wrapper">
    <div
      v-for="fish in $store.state.filterFish"
      :key="fish.fish_id"
      class="fish"
      :checked="fish.checked"
      @click="selectFish(fish)"
    >
      <div class="zone">{{ fish.fish_zone }}</div>
      <span nm>{{ fish.fish_name }}</span>
      <img :src="fish.fish_img" alt="" />
      <div class="details">
        <span
          >Bait: <span>{{ fish.fish_bait }}</span></span
        >
        <span
          >Sold for: <span>{{ fish.fish_gold }}</span></span
        >
        <span
          >Rarity: <span :style="rarityColor(fish.fish_rarity)">{{ fish.fish_rarity }}</span></span
        >
        <span
          >Time: <span>{{ fish.fish_time }}</span></span
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import JSConfetti from "js-confetti";

export default {
  mounted() {
    this.loadFishes();
    document.querySelector("#inpsearch").focus();
  },
  methods: {
    async loadFishes() {
      await axios
        .post(
          "https://ashypls-001-site1.ftempurl.com/puzzler.asmx/createFishList",
          {
            contentType: "application/json",
          }
        )
        .then((response) => {
          this.$store.state.fishes = JSON.parse(response.data.d);
          this.$store.state.filterFish = this.$store.state.fishes;
          this.$store.state.appLoaded = true;
        });
    },
    filterFish() {
      this.$store.state.filterFish = [];

      if(!this.$store.state.fishes){
        return;
      }

      this.$store.state.fishes.forEach((fish) => {
        let pushFish = false;

        if (
          fish.fish_name
            .toLowerCase()
            .includes(this.$store.state.searchTerm.toLowerCase())
        ) {
          pushFish = true;
        }
        if (
          fish.fish_bait
            .toLowerCase()
            .includes(this.$store.state.searchTerm.toLowerCase())
        ) {
          pushFish = true;
        }
        if (
          fish.fish_time
            .toLowerCase()
            .includes(this.$store.state.searchTerm.toLowerCase())
        ) {
          pushFish = true;
        }
        if (
          fish.fish_zone
            .toLowerCase()
            .includes(this.$store.state.searchTerm.toLowerCase())
        ) {
          pushFish = true;
        }
        if (
          fish.fish_rarity
            .toLowerCase()
            .includes(this.$store.state.searchTerm.toLowerCase())
        ) {
          pushFish = true;
        }

        if (this.$store.state.mode == "checked" && fish.checked == false) {
          pushFish = false;
        }

        if (this.$store.state.mode == "unchecked" && fish.checked == true) {
          pushFish = false;
        }

        if (pushFish) {
          this.$store.state.filterFish.push(fish);
        }
      });
    },
    async selectFish(fish) {
      fish.checked = !fish.checked;
      //console.log(this.$store.state.fishes)
      //sync the fishes
      await axios
        .post(
          "https://ashypls-001-site1.ftempurl.com/puzzler.asmx/updateFishList",
          {
            contentType: "application/json",
            fishes: JSON.stringify(this.$store.state.fishes),
          }
        )
        .then((response) => {
          //console.log(response.data.d);

          //check all completed
          let flagAsComplete = true;
          this.$store.state.fishes.forEach((fish) => {
            if (fish.checked == false) {
              flagAsComplete = false;
            }
          });

          this.$store.state.completed = flagAsComplete;

          if (flagAsComplete == true) {
            const jsConfetti = new JSConfetti();
            jsConfetti.addConfetti();
            var audio = new Audio('https://ashypls.com/Sounds/woot.mp3');
            audio.play();
          }
        });
    },
    rarityColor(fishrarity){
      switch(fishrarity){
        case "Common" : return "color:#6dff6d";
        case "Uncommon": return "color:#a1a1a1";
        case "Rare" : return "color:#55b7ff";
        case "Epic" : return "color:#ff29ff";
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
  color: white;
  font-size: 200%;
}
.wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  justify-content: center;

  .fish {
    position: relative;
    background: #34405ae8;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    width: 400px;
    border: solid 5px #10234d;
    overflow: hidden;
    gap: 0.5rem;
    user-select: none;
    cursor: pointer;

    @media screen and (max-width: 600px) {
      width: 100%;
    }

    &[checked="true"] {
      border-color: #3aa948;
      .zone {
        background: #3aa948;
      }
    }

    &:hover {
      border-color: #ffffff66;
    }

    .zone {
      background: #10234d;
      text-align: center;
      font-size: 120%;
      padding: 0.5rem;
      color: white;
    }

    &[checked="true"] {
      border-color: #3aa948;
      .zone {
        background: #3aa948;
      }
    }

    img {
      width: 100px;
      aspect-ratio: 1;
      object-fit: contain;
      // border:solid 3px #34405ae8;
      position: absolute;
      left: 10px;
      bottom: 0;
      transform: translateY(-50px);
    }
    span {
      &[nm] {
        font-size: 150%;
        color: #fdff9e;
        text-align: center;
        justify-content: center;
        width: 100%;
        flex-grow: 1;
      }
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: white;
      margin-left: 120px;
      width: calc(100% - 10rem);
      padding: 1rem;

      span {
        display: flex;
        justify-content: space-between;
        color: white;
        span {
          color: #f7b901;
        }
      }
    }
  }
}
.completed {
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: #000000ae;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  z-index: 999;

  span {
    background: #10234d;
    width: calc(100vw - 2rem);
    max-width: 700px;
    padding: 1rem;
    color: white;
    font-size: 1.5rem;
    border-radius: 1rem;
    border: solid 5px #4369bb;
    text-align: center;
  }
}

.searcher {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex-direction: column;

  @media screen and (max-width: 600px) {
  }

  .search-box {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .checker {
    display: flex;
    justify-content: center;
    padding: 1rem;
    gap: 0.5rem;

    button {
      padding: 0.5rem;
      font-size: 100%;
      border: 0;
      border-radius: 0.5rem;
      cursor: pointer;

      &[selected="true"] {
        background: #e58129;
        color: white;
      }

      &[selected="false"] {
        background: #0000008f;
        color: white;
      }

      &:hover {
        outline: solid 3px #f7b901;
        color: white;
      }
    }
  }

  input {
    width: 100vw;
    max-width: 600px;
    font-size: 120%;
    padding: 1rem;
    background: #10234d;
    color: white;
    border-radius: 1rem;
    outline: none;
    border: solid 5px #eef2fbe8;
    margin: 0 auto;

    @media screen and (max-width: 600px) {
      width: calc(100% - 2rem);
      max-width: unset;
    }
  }
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2rem;
  width: 100%;
  font-size: 200%;
  color: white;

  img {
    @media screen and (max-width: 600px) {
      width: 100%;
    }
  }
}
</style>