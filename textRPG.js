const $getUserNickNameForm = document.querySelector('.getusernicknameform');
const $nomalMode = document.querySelector('#nomalmode');
const $adventureMode = document.querySelector('#adventuremode')
const $userInfor = document.querySelector('.userinfor');
const $startMenuForm = document.querySelector('.startmenuform');
const $adventureForm = document.querySelector('.adventureform');
const $adventureModeUserInfor = document.querySelector('.adventuremodeuserinfor');
const $monsterProfile = document.querySelector('.monsterprofile');
const $resultHistory = document.querySelector('.resulthistory');
const $respawnBackground = document.querySelector('.respawnbackground');
const $itemList = document.querySelector('.itemlist');
const $storeMode = document.querySelector('.storemode');
const $currentUserMoney = document.querySelector('.currentusermoney');
const $normalModeButton = document.querySelector('.normalmodebutton');


const createUser = (e) => {
    e.preventDefault();
    userName = e.target[0].value;
    const game = new Game(userName)
}

$getUserNickNameForm.addEventListener('submit', createUser)


class Game {
    constructor(name){
        this.monster = null;
        this.hero = new Hero(name);
        this.monsterList = [
            { name: '슬라임', HP:25 ,hp: 25, att: 10, xp: 10, heart:true, money: 100,},
            { name: '스켈레톤', Hp:50 ,hp: 50, att: 15, xp: 20, heart:true, money: 200},
            { name: '마왕', HP:150, hp: 150, att: 35, xp: 50, heart:true, money: 1000},
        ];
        this.start()
    }
    start(){
        this.toNormalMode()
        $startMenuForm.addEventListener('submit', this.onGameMenuInput);
        $adventureForm.addEventListener('submit', this.onAdventureMenuInput);
    }

    onGameMenuInput = (e) => {
        e.preventDefault();
        const selectedNumber = e.target[0].value;
        if(selectedNumber === "1"){
            this.toAdventureMode()
            this.selectMonster()
        }else if(selectedNumber === "2"){
            console.log('회복')
        }else if(selectedNumber === "3"){
            console.log('상점')
            this.toStoreMode()
        }
    }

    onAdventureMenuInput = (e) => {
        e.preventDefault();
        if(this.hero.heart && this.monster.heart){
          const selectedNumber = e.target[0].value;
          if(selectedNumber === '1'){
            this.attackMonster()
            this.isMonsterDead()
          }else if(selectedNumber === '2'){
            this.healUser()
          }else if(selectedNumber === '3'){
            this.runAway()
          } 
        }
        
    }

    runAway(){
        if(this.isRunAway()){
            this.hero.money -= 500;
            this.toNormalMode()
        }else{
            alert('도망칠 수 없습니다')
        }
    }

    isRunAway(){
        if(this.hero.money >= 500){
            return true;
        }
        return false;
    }

    isMonsterDead(){
        if(this.monster.hp <= 0){
            this.monster.heart = false;
            this.hero.xp += this.monster.xp;
            this.hero.money += this.monster.money;
            this.monster.hp = 0;
            alert(`몬스터가 사망하였습니다 ${this.monster.xp}의 경험치를 획득하였습니다.`);
            this.updateUserProfile();
            this.updateMonsterProfile();
            this.toNormalMode();
        }else if(this.monster.hp > 0) {
            this.updateMonsterProfile();
            this.attackUser();
            this.isUserDead();
        }
    }

    isUserDead(){
        if(this.hero.hp <= 0){
            this.hero.heart = false;
            this.hero.hp = 0;
            this.updateUserProfile();
            this.watingRespawn();
        }else if(this.hero.hp > 0){
            this.updateUserProfile()
        }
    }
    watingRespawn(){
        $respawnBackground.style.display = "block";
        setTimeout(() => {
            this.hero.heart = true;
            this.hero.hp = this.hero.HP/2;
            this.hero.xp /= 2;
            this.hero.money /= 2;
            $respawnBackground.style.display = "none";
            this.toNormalMode();
        }, 2000)
    }
 
    attackMonster(){
        this.monster.hp -= this.hero.att;
    }
    attackUser(){
        this.hero.hp -= this.monster.att;
    }

    selectMonster(){ 
       this.monster = JSON.parse(JSON.stringify(this.monsterList[this.randomNumber()])) // 깊은 복사 
       this.updateMonsterProfile()
    }

    
    randomNumber(){
        return Math.floor(Math.random() * this.monsterList.length);
    }

    toNormalMode(){
        $getUserNickNameForm.style.display = 'none';
        $storeMode.style.display = "none";
        $adventureMode.style.display = 'none';
        $nomalMode.style.display = 'block';
        this.hero.mode = 'normal';
        this.updateUserProfile();

    }
    toAdventureMode(){
        $nomalMode.style.display = 'none';
        $adventureMode.style.display = 'block';
        this.hero.mode = 'adventure';
        this.updateUserProfile();

    }

    toStoreMode(){
        $nomalMode.style.display = 'none';
        const store = new Store(this.hero);
        $storeMode.style.display = 'block';
    }
    
    updateMonsterProfile(){
       $monsterProfile.textContent = `${this.monster.name}이 출현했다!! HP:${this.monster.hp} ATT:${this.monster.att}`

    }

   updateUserProfile(){
        if(this.hero.mode === 'normal'){
            $userInfor.textContent =`${this.hero.name}님 HP: ${this.hero.hp} XP: ${this.hero.xp} ATT: ${this.hero.att} MONEY:${this.hero.money}`
        }else if(this.hero.mode === 'adventure'){
            $adventureModeUserInfor.textContent = `${this.hero.name}님 HP: ${this.hero.hp} XP:${this.hero.xp} ATT:${this.hero.att} MONEY:${this.hero.money}`
        }
    }

  
}


class Hero{
    constructor(name){
        this.name = name;
        this.hp = 100;
        this.HP = 100;
        this.xp = 0;
        this.att = 10; 
        this.heart = true;
        this.money = 6000;
        this.bag = [];
        this.mode = 'normal';
    }
}

class Store{
    constructor(hero){
        this.hero = hero;
        this.item = null;
        this.itemsArray = [
            {name:"posion", price: 500,},
            {name: 'shoes', price: 1000,},
            {name: 'clothes', price: 1500,},
        ]
        this.updateItem()
        this.updateUserMoney()
        this.onStoreMenuButton()
    }
    onStoreMenuButton(){
        $itemList.addEventListener('click', this.purchaseItem)
        $normalModeButton.addEventListener('click', this.toNormalMode)
    }
    
    toNormalMode = () => {
        $storeMode.style.display = "none";
        $nomalMode.style.display = "block";
        this.updateUser();

    }
    updateUser(){
        $userInfor.textContent =`${this.hero.name}님 HP: ${this.hero.hp} XP: ${this.hero.xp} ATT: ${this.hero.att} MONEY:${this.hero.money}`
    }
   
    purchaseItem = (e) => {
        if(e.target.tagName === 'BUTTON'){
            this.item = JSON.parse(JSON.stringify(this.itemsArray[e.target.className]))
            if(this.isHaveMoney()){
                console.log('구입가능')
                if(this.isFirstPurchase() || !this.isItemExisting()){
                    this.item.count = 1;
                    this.hero.bag.push(this.item)
                    this.minusMoney();
                    console.log(this.hero.bag);
                    return
                }
                this.addItemCount();
                console.log(this.hero.bag)
            }else{
                console.log('돈이 없습니다.')
            }
            // if(this.isHaveMoney(item)){
            //     if(confirm('구입하시겠습니까?')){
            //         this.hero.money -= item.price;
            //         this.isFirstPurchase(item)
            //         this.updateUserMoney()
            //         console.log(this.hero.bag)
            //     }
            // }else{
            //     console.log('돈이 없습니다')
            // }
        }
    }

    addItemCount(){
        for(let i = 0; i < this.hero.bag.length; i++){
            if(this.item.name === this.hero.bag[i].name){
                this.hero.bag[i].count++
                break
            }
        }
        this.minusMoney()
    }

    minusMoney(){
        this.hero.money -= this.item.price;
        this.updateUserMoney();
    }

    isItemExisting(){
      return this.hero.bag.some((Element) => Element.name === this.item.name)
    }

    isFirstPurchase(){
        if(this.hero.bag.length === 0){
            return true;
        }
        return false;
    }

    isHaveMoney(){
       if(this.item.price <= this.hero.money){
            return true;
       }
       return false;
        
    }

    // isFirstPurchase(item){
    //     if(this.hero.bag.length === 0){
    //         this.addItemToBag(item)
    //     }else{
    //         this.isExistingItem(item)
    //     }
    // }

    // addItemToBag(item){
    //     item.count = 1;
    //     this.hero.bag.push(item)
    // }

    // isExistingItem(item){  
    //  for(let i = 0; i < this.hero.bag.length; i++){
    //     if(this.hero.bag[i].name === item.name){
    //        this.hero.bag[i].count++
    //        break; 
    //     }else{
    //         this.addItemToBag(item)
    //     }
    //  }

       
    // }
    
    isHaveMoney(){
        if(this.hero.money >= this.item.price){
            return true;
        }else if(this.hero.money < this.item.price){
           return false;
        }
    }

    updateItem(){
        $itemList.innerHTML = ""
       this.itemsArray.forEach((a, i) => {
            const div = document.createElement('div');
            const span = document.createElement('span');
            const button = document.createElement('button');
            button.classList.add(i)
            button.textContent = '구매';
            span.textContent = `${a.name} $${a.price}`
            div.append(span)
            div.append(button)
            $itemList.append(div)
       })
    }

    updateUserMoney(){
        $currentUserMoney.textContent = `내가 보유한 돈: ${this.hero.money}`;
    }
}


// class ScreenChange{
//     constructor(hero) {
//         this.hero = hero
//     }
//     static toNormalMode = () =>{
//         $getUserNickNameForm.style.display = 'none';
//         $storeMode.style.display = "none";
//         $adventureMode.style.display = 'none';
//         $nomalMode.style.display = 'block';
//         // hero.mode = 'normal';
//         console.log(this.hero.mode)
//         this.updateUserProfile();    
//     }

//     static toAdventureMode = () =>{
//         $nomalMode.style.display = 'none';
//         $adventureMode.style.display = 'block';
//         this.hero.mode = 'adventure';
//         this.updateUserProfile();
//     }

//     static toStoreMode = () => {
//         $nomalMode.style.display = 'none';
//         $storeMode.style.display = 'block';
//         this.hero.mode = 'store';
//         const store = new Store(this.hero);
//     }

//     static updateUserProfile(){
//     if(this.hero.mode === 'normal'){
//         $userInfor.textContent =`${this.hero.name}님 HP: ${this.hero.hp} XP: ${this.hero.xp} ATT: ${this.hero.att} MONEY:${this.hero.money}`
//     }else if(this.hero.mode === 'adventure'){
//         $adventureModeUserInfor.textContent = `${this.hero.name}님 HP: ${this.hero.hp} XP:${this.hero.xp} ATT:${this.hero.att} MONEY:${this.hero.money}`
//     }
// }
// }