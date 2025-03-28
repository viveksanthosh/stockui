'use strict';

angular.module('practiceApp')
  .controller('TradeCtrl', function ($scope) {

    $scope.init = function () {
      $scope.selectedStock = '';
      $scope.buyerTeam = '';
      $scope.sellerTeam = '';
      $scope.selectedQuantity = 0;
      $scope.selectedPrice = 0;

    };

    $scope.transact = function () {
      if ($scope.$parent.user === '') {
        window.alert('Please Login');
        return;
      }
      var circuit = $scope.$parent.stockData[$scope.selectedStock].circuitPrice * $scope.$parent.stockData[$scope.selectedStock].circuitPercentage / 100;
      var upCircuit = ($scope.$parent.stockData[$scope.selectedStock].circuitPrice * 1 ) + (circuit * 1);
      var downCircuit = $scope.$parent.stockData[$scope.selectedStock].circuitPrice - circuit;
      var tradePrice = $scope.selectedPrice * $scope.selectedQuantity;

      if (upCircuit >= $scope.selectedPrice || ($scope.$parent.stockData[$scope.selectedStock].circuitPercentage * 1) === 100) {
        if (downCircuit <= $scope.selectedPrice) {
          if (($scope.$parent.playerData[$scope.buyerTeam].cash * 1) >= tradePrice) {
            if (($scope.$parent.playerData[$scope.sellerTeam].stock[$scope.selectedStock].quantity * 1) >= ($scope.selectedQuantity * 1)) {

              $scope.$parent.playerData[$scope.buyerTeam].stock[$scope.selectedStock].quantity = ($scope.$parent.playerData[$scope.buyerTeam].stock[$scope.selectedStock].quantity * 1) + ($scope.selectedQuantity * 1);
              $scope.$parent.playerData[$scope.sellerTeam].stock[$scope.selectedStock].quantity = ($scope.$parent.playerData[$scope.sellerTeam].stock[$scope.selectedStock].quantity * 1) - ($scope.selectedQuantity * 1);
              $scope.$parent.playerData[$scope.buyerTeam].cash -= tradePrice;
              $scope.$parent.playerData[$scope.sellerTeam].cash = ($scope.$parent.playerData[$scope.sellerTeam].cash * 1) + (tradePrice * 1);

              var message = 'Sold ' + $scope.selectedQuantity + ' ' + $scope.$parent.stockData[$scope.selectedStock].name + ' to ' + $scope.$parent.playerData[$scope.buyerTeam].name + ' via ' + $scope.$parent.user + ' at ' + $scope.selectedPrice + ' for a total value of ' + tradePrice + ' at ' + Date();
              $scope.$parent.playerData[$scope.sellerTeam].credits.unshift(message);
              message = 'Purchased ' + $scope.selectedQuantity + ' ' + $scope.$parent.stockData[$scope.selectedStock].name + ' from ' + $scope.$parent.playerData[$scope.sellerTeam].name + ' via ' + $scope.$parent.user + ' at ' + $scope.selectedPrice + ' for a total value of ' + tradePrice + ' at ' + Date();
              $scope.$parent.playerData[$scope.buyerTeam].debits.unshift(message);
              $scope.$parent.playerData.$save($scope.$parent.playerData[$scope.sellerTeam]);
              $scope.$parent.playerData.$save($scope.$parent.playerData[$scope.buyerTeam]);

              var ltp = 0;
              $scope.$parent.stockData[$scope.selectedStock].totalTrade.unshift(tradePrice);
              $scope.$parent.stockData[$scope.selectedStock].totalQuantity.unshift(($scope.selectedQuantity * 1));


              if ($scope.$parent.stockData[$scope.selectedStock].totalTrade.length > 3) {
                ltp = ((($scope.$parent.stockData[$scope.selectedStock].totalTrade[0] * 1) + ($scope.$parent.stockData[$scope.selectedStock].totalTrade[1] * 1) + ($scope.$parent.stockData[$scope.selectedStock].totalTrade[2] * 1)) / (($scope.$parent.stockData[$scope.selectedStock].totalQuantity[0] * 1) + ($scope.$parent.stockData[$scope.selectedStock].totalQuantity[1] * 1) + ($scope.$parent.stockData[$scope.selectedStock].totalQuantity[2] * 1))).toFixed(2);

                if ($scope.$parent.stockData[$scope.selectedStock].ltp > ltp) {
                  $scope.$parent.stockData[$scope.selectedStock].arrow = 0;
                  $scope.$parent.stockData[$scope.selectedStock].highlight = 'bg-danger';
                } else {
                  $scope.$parent.stockData[$scope.selectedStock].arrow = 1;
                  $scope.$parent.stockData[$scope.selectedStock].highlight = 'bg-success';
                }
                $scope.$parent.stockData[$scope.selectedStock].ltp = ltp;
              }


              $scope.$parent.stockData.$save($scope.$parent.stockData[$scope.selectedStock]);

              message = $scope.$parent.playerData[$scope.sellerTeam].name + ' Sold ' + $scope.selectedQuantity + ' ' + $scope.$parent.stockData[$scope.selectedStock].name + ' to ' + $scope.$parent.playerData[$scope.buyerTeam].name + ' via ' + $scope.$parent.user + ' at ' + $scope.selectedPrice + ' for a total value of ' + tradePrice + ' at ' + Date();
              $scope.$parent.transactionData[0].trades.unshift(message);
              $scope.$parent.transactionData.$save($scope.$parent.transactionData[0]);
              window.alert('Trade Done Successfully');

            } else {
              window.alert('Not enough quantity to sell');
            }
          }
          else {
            window.alert('Not enough cash to buy');
          }

        } else {
          window.alert('Lower Circuit Hit, Please trade between ' + downCircuit.toFixed(2) + ' and ' + upCircuit.toFixed(2));
        }
      }
      else {
        window.alert('Upper Circuit Hit, Please trade between ' + downCircuit.toFixed(2) + ' and ' + upCircuit.toFixed(2));
      }

    };
  }
);
