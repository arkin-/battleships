/* globals env_json */
;(function() {
    'use strict';

    angular.module('app').controller('LobbyController', Controller);

    function Controller($timeout) {
        var vm = this;

        var socket = io.connect();

        vm.messages = [];
        vm.players = [];

        socket.on('update', function(data) {
            $timeout(() => {
                vm.player = data.player;
                vm.players = data.players;
            });
        });

        socket.on('lobby message', function(message) {
            $timeout(() => vm.messages.push(message));
        });

        socket.on('enter', function(player) {
            $timeout(() => vm.players.push(player));
        });

        socket.on('exit', function(player) {
            $timeout(() => vm.players.splice(player, 1));
        });

        vm.send = function() {
            socket.emit('lobby message', vm.message);
            vm.message = '';
        };
    }
})();
