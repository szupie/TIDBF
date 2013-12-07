var PartyGoerGenObject = function() {
    
    //private vars
    var people = new createjs.Container();
    var wanderSpeed = 30;
    var danceSpeed = 30;
    var everyoneNeedtoLeave = false;
    var ecstasy = false;
    document.addEventListener("threeKey", ecstasyHandler);

    //private funcs
    function checkForCollisions(goer_) {
        for (var i =0; i < people.getNumChildren(); i++) {
            if(circlesDoCollide(people.getChildAt(i), goer_))
                return true;
        }
        return false;
    }

    function ecstasyHandler() {
        if(!ecstasy && gameObject.getHud().getStars() >= ECSTACYCOST) {
            ecstasy = true;
            setTimeout(function() {
                ecstasy = false;
            }, 10000);
        }
    }

    function getDistanceBtwObjectAndPos(obj, pos) {
        var xDist = obj.getPosition().x - pos.x;
        var yDist = obj.getPosition().y - pos.y;

        return Math.sqrt(xDist * xDist + yDist * yDist);
    }

    function drawPartyGoer() {
        var goer = new PartyGoerObject();
        //while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        //}
        people.addChild(goer);
        var pos = getRandomPosOutside();
        var distance = getDistanceBtwObjectAndPos(goer, pos);
        createjs.Tween.get(goer.getShape()).to(pos, wanderSpeed * distance, createjs.Ease.linear);
    }

    function stayAway(obj) {

        var pos;
        distance = getDistance(obj, gameObject.getBabyRepo());
        createjs.Tween.removeTweens(obj.getShape());
        do {
            pos = getANearByPosition(obj.getPosition());
        } while (distance >= getDistanceBtwObjectAndPos(gameObject.getBabyRepo(), pos));
        createjs.Tween.get(obj.getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(obj, pos), createjs.Ease.linear);
    }

    function kickEveryoneOut() {
        for (var i =0; i < people.getNumChildren(); i++) {
            pos = getRandomPosOutside();
            createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
        }
    }

    function getANearByPosition(pos) {
        return {
            x: pos.x + getRandomSign() * 100 * Math.random(),
            y: pos.y + getRandomSign() * 100 * Math.random()
        };
    }

    function getRandomPosInParty() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var radiusDiff = doorRadius - babyRepoRadius;

        return {
            x: babyRepoPosition.x + getRandomSign() * (babyRepoRadius + Math.random() * radiusDiff),
            y: babyRepoPosition.y + getRandomSign() * (babyRepoRadius + Math.random() * radiusDiff)
        };
    }

    function getRandomPosOutside() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        return {
            x: babyRepoPosition.x + getRandomSign() * (doorRadius + 10 + Math.random() * (CONSTANTS.WIDTH - doorRadius)),
            y: babyRepoPosition.y + getRandomSign() * (doorRadius + 10 + Math.random() * (CONSTANTS.HEIGHT - doorRadius))
        };
    }

    function collisionBehaviors() {

        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var distance;
        var pos;

        /*for (var i in people) {
            if (checkForCollisions(people[i])) {
                createjs.Tween.removeTweens(people[i].getShape());
                pos = getANearByPosition(people[i].getPosition());
                createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            }
        }*/
        
        for (var j =0; j < people.getNumChildren(); j++) {

            distance = getDistance(people.getChildAt(j), babyRepo);

            if (distance < babyRepoRadius + 1.5 * people.getChildAt(j).getRadius()) {
                stayAway(people.getChildAt(j));
            } else if (distance > 3/4 * doorRadius && distance < doorRadius) {
                if (people.getChildAt(j).checkWantToParty()) {
                    createjs.Tween.removeTweens(people.getChildAt(j).getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people.getChildAt(j).getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people.getChildAt(j), pos), createjs.Ease.linear);
                }
            } else if (distance < 1.2 * doorRadius && !people.getChildAt(j).checkWantToParty()) {
                stayAway(people.getChildAt(j));
            }
        }

        /*if (everyoneNeedtoLeave) {
            kickEveryoneOut();
        }*/
    }

    function moveAll() {

        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var pos;

        for (var i = 0; i < people.getNumChildren(); i++) {

            var distance = getDistance(people.getChildAt(i), babyRepo);
            var offset = 2/3 * Math.random() * (doorRadius - babyRepoRadius);

            if (distance < babyRepoRadius + people.getChildAt(i).getRadius() + offset) {
                createjs.Tween.removeTweens(people.getChildAt(i).getShape());
                pos = getRandomPosInParty();
                createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
            } else {
                
                if (Math.random() < doorRadius / distance) {
                    people.getChildAt(i).likeParty();
                    createjs.Tween.removeTweens(people.getChildAt(i).getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
                } else {
                    createjs.Tween.removeTweens(people.getChildAt(i).getShape());
                    pos = getRandomPosOutside();
                    createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
                }
            }
        }
        
        /*var overflow = getPartySize() - gameObject.getPartyLimit();
        for (var j = 0; j < overflow; j++) {
            people[i].isLeaving();
            createjs.Tween.removeTweens(people[i].getShape());
            pos = getRandomEdgePos();
            createjs.Tween.get(people[j].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
        }*/
    }

    function getPeopleInParty() {
        var peeps = [];
        for (var i =0; i < people.getNumChildren(); i++) {
            if (getDistance(people.getChildAt(i), gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                peeps.push(people.getChildAt(i));
            }
        }
        return peeps;
    }

    function getPartySize() {
        var num = 0;
        for (var i =0; i < people.getNumChildren(); i++) {
            if (getDistance(people.getChildAt(i), gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                num++;
            }
        }
        return num;
    }

    //public funcs
    this.addPartyGoer = function() {
        drawPartyGoer();
    };

    var count = 0;
    this.tick = function() {
        collisionBehaviors();
        if(ecstasy) {
            if(count === 10) {
                for (var i in getPeopleInParty()) {
                    var position = getPeopleInParty()[i].getPosition();
                    var juice = new JuicySplosion(position, 30, getRandomColorWithOpacity(0.6));
                }
                count = 0;
            }
            count++;
        }
    };

    this.wander = function() {
        moveAll();
    };

    this.getGoer = function() {
        return people;
    };

    this.size = function() {
        return people.length;
    };

    this.partySize = function() {
        return getPartySize();
    };

    this.pause = function() {
        for (var i =0; i < people.getNumChildren(); i++) {
            createjs.Tween.removeTweens(people.getChildAt(i).getShape());
        }
    };

    this.backToParty = function() {
        everyoneNeedtoLeave = false;
        moveAll();
    };
    
    this.reset = function() {
        //everyoneNeedtoLeave = true;
        //kickEveryoneOut();
        /*for (var i in people) {
            people[i].removeFromStage();
        }*/
        //people = [];
    };

    this.clearPeople = function() {
        people.removeAllChildren();
    };

    this.getPeopleInParty = function() {
        getPeopleInParty();
    };
};
