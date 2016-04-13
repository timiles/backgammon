var DiceUI = (function () {
    function DiceUI(diceContainerElementId) {
        this.diceContainerDiv = document.getElementById(diceContainerElementId);
    }
    DiceUI.prototype.setDiceRolls = function (roll1, roll2) {
        this.diceContainerDiv.innerText = roll1 + ", " + roll2;
    };
    return DiceUI;
})();
