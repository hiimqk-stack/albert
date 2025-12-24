class Jackpot {
    'use strict';
    constructor({ contNodeId, jackpotNodesClass, jackpotNumbers, jackpotType, stepCount, digitsAfterPoint }) {
        this.contNode = document.getElementById(contNodeId);
        this.contNode.Jackpot = this;
        this.flipInterval = 0;
        if (this.contNode === undefined) return;
        this.jackpotNodes = this.contNode.getElementsByClassName(jackpotNodesClass);
        if (this.jackpotNodes === undefined || this.jackpotNodes.length == 0) return;
        this.jackpotNumbers = jackpotNumbers;
        this.jackpotType = jackpotType;
        this.digitsAfterPoint = digitsAfterPoint;
        this.stepCount = this.#calculateFirstStepCount(this.jackpotNumbers, this.digitsAfterPoint);
        this.#startJack(this.jackpotNodes, this.jackpotNumbers);
    };

    #calculateFirstStepCount(numbers, digitAfterPoint) {
        let smallestNumber = 0;
        for (const nmbr of numbers) {
            if (smallestNumber == 0 || parseInt(nmbr) < parseInt(smallestNumber)) {
                smallestNumber = nmbr;
            }
        }
        
        let result = Math.round(smallestNumber * 0.3);

        switch (digitAfterPoint) {
            case 1:
                return result > 10000 ? 10000 : result;
            case 2:
                return result > 100000 ? 100000 : result;
            case 3:
                return result > 1000000 ? 1000000 : result;
            case 4:
                return result > 10000000 ? 10000000 : result;
            default:
                return result > 1000 ? 1000 : result;
        }
    }

    #startJack(nodes, numbers) {
        
        let ndsLength = nodes.length;
        for (let i = 0; i < ndsLength; i++) {
            nodes[i].number = numbers[i];
            nodes[i].jackpot = new FlipJackpotNumbers({
                node: nodes[i],
                from: numbers[i] == 0 ? 0 : numbers[i] - this.stepCount,
                seperateOnly: this.digitsAfterPoint,
            });
        }

        this.#flip(numbers, nodes);
    };

    #flip(numbers, nodes) {
        let ndsLength = nodes.length;

        for (let i = 0; i < ndsLength; i++) {
            if (nodes[i].number > numbers[i]) {
                nodes[i].jackWon = true;
                nodes[i].classList.add('blink');
            } else {
                if (nodes[i].jackWon) {
                    nodes[i].jackpot.destroy();
                    nodes[i].jackpot = new FlipJackpotNumbers({
                        node: nodes[i],
                        from: nodes[i].number,
                        seperateOnly: this.digitsAfterPoint,
                    });
                    nodes[i].jackWon = false;
                }
                if ((nodes[i].number - this.stepCount).toString().length < numbers[i].toString().length) {
                    nodes[i].children[0].classList.remove('hide');
                }
                nodes[i].jackpot.flipTo({
                    to: numbers[i],
                    direct: false
                });
            }
        }

        this.flipInterval = setTimeout(() => {
            let _jackpot = this;
            $.ajax({
                url: "/Common/GetJack?type=" + _jackpot.jackpotType,
                type: "POST",
                datatype: "json",
                showLoader: false,
                success: function (result) {
                    if (result != '' && result.length > 0) {
                        _jackpot.#flip(result, nodes);
                    }
                }
            });
        }, 30050);
    };

    destroy() {
        let ndsLength = this.jackpotNodes.length;
        if (ndsLength > 0) {
            for (let i = 0; i < ndsLength; i++) {
                if (typeof this.jackpotNodes[i].jackpot == 'object') {
                    this.jackpotNodes[i].jackpot.destroy();
                }
            }
        }
        if (typeof this.flipInterval != 'undefined') {
            clearInterval(this.flipInterval);
        }
    }
}