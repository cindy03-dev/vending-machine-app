# Vending Machine Program for pre-assignment

## Skill

- **Languages**: React, TypeScript
- **Package Manager**: Yarn

## Description
- 사용자가 사용가능한 결제수단은 2가지 입니다.
```
1. 현금 : 100원 / 500원 / 1,000원 / 5,000원 / 10,000원권 사용가능
2. 카드 : 카드결제 가능
```
- 구매 가능한 음료수는 다음과 같습니다.
```
1. 콜라: 1,100원
2. 물: 600원
3. 커피: 700원
```
- 재고가 없는 음료수는 비활성화 처리 됩니다.
- 금액 투입(현금) 또는 카드 투입 시 구매 가능한 음료는 빨간색 버튼으로 변경됩니다.
- 현금은 잔액이 남았을 시 잔돈 반환 전까지 계속 음료수 선택이 가능하며 추가 금액 투입도 가능합니다.
- 카드 결제 선택 후 음료를 고를 수 있으며, 선택된 1개의 음료수에 한하여 카드 승인 후 종료됩니다. 카드 결제 가능 시간은 30초입니다.
- 결제 수단을 중간에 변경 시, 이전 결제 수단은 취소됩니다. (현금은 반환됨)
- 현재 구현된 자판기에서 결제하는 카드의 한도가 없으며, 자판기에서 거슬러줄 수 있는 돈은 무한하다고 가정합니다.

![Alt text](/public/vending-machine-preview.png)

## Vending Machine Diagram

[link to diagram](https://drive.google.com/file/d/1soizfoBf_we-F8E4AoVc_0C3by9mhcj6/view?usp=sharing)


![Alt text](/public/vending-machine-diagram.png)

## How to Run the Project

1. First, install the project dependencies:

   ```bash
   yarn install
   ```

2. Next, start the development server:
   ```bash
   yarn start
   ```
3. Open your web browser and navigate to http://localhost:3000 to view it in your browser.
