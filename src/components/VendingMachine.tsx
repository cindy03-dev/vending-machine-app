import React, { useEffect, useState } from "react";
import "./VendingMachine.css";

type Drink = {
  name: string;
  price: number;
  count: number; // 음료 남은 개수
  image: string;
};

const drinks: Drink[] = [
  { name: "콜라", price: 1100, count: 5, image: "/img/coke.png" },
  { name: "물", price: 600, count: 3, image: "/img/water.png" },
  { name: "커피", price: 700, count: 1, image: "/img/coffee.png" },
];

// 허용 가능한 동전, 화폐 리스트
const COIN_LIST = [100, 500];
const BILL_LIST = [1000, 5000, 10000];

type PaymentType = "cash" | "card";

interface InsertCashButtonProps {
  onInsertCash: (cash: number) => void;
}

/**
 * 현금 투입 버튼 컴포넌트
 */
const InsertCashButton: React.FC<InsertCashButtonProps> = ({
  onInsertCash,
}) => {
  const cashType = [...COIN_LIST, ...BILL_LIST];

  return (
    <>
      <h3>금액 투입</h3>
      <div className="cash-btn-group">
        {cashType.map((cash) => (
          <>
            <button key={cash} onClick={() => onInsertCash(cash)}>
              {cash}원 {cash < 1000 ? "동전" : "지폐"} 투입
            </button>
            {cash === 500 && <br />}
          </>
        ))}
      </div>
    </>
  );
};

/**
 * 자판기 컴포넌트
 */
const VendingMachine: React.FC = () => {
  const [drinkList, setDrinkList] = useState<Drink[]>(drinks); // 음료 재고 관리를 위한 음료 리스트
  const [paymentMethod, setPaymentMethod] = useState<PaymentType | undefined>(
    undefined
  ); // 결제 방식

  const [cardActiveTime, setCardActiveTime] = useState<number>(0); // 카드 결제 활성화 시간
  const [totalCash, setTotalCash] = useState<number>(0); // 투입한 총 현금 금액
  const [message, setMessage] = useState<string>("");

  // 카드 결제 타이머 관리
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (paymentMethod === "card" && cardActiveTime > 0) {
      // 타이머 설정
      timer = setInterval(() => {
        setCardActiveTime((prev) => {
          if (prev <= 1) {
            setMessage("카드 결제 시간이 만료되었습니다.");
            setPaymentMethod(undefined); // 결제 방법 초기화
            return 0; // 타이머 종료
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer); // 타이머 정리
    };
  }, [paymentMethod, cardActiveTime]);

  // 음료 수량 감소 함수
  const updateDrinkCount = (drinkName: string) => {
    setDrinkList((prevList) =>
      prevList.map((d) =>
        d.name === drinkName ? { ...d, count: d.count - 1 } : d
      )
    );
  };

  // 음료 버튼을 눌렀을 때 동작
  const handleSelectDrink = (drink: Drink) => {
    if (paymentMethod === undefined) {
      // 결제 방식 미선택시
      setMessage("결제 방법을 선택해주세요 (현금/카드).");
      return;
    }

    if (paymentMethod === "card") {
      // 카드 결제 선택시
      setMessage("카드 결제 시도 중...");
      setTimeout(() => {
        setMessage(`카드 결제 성공! 음료 ${drink.name} 구매 완료.`);

        // 음료 재고 감소
        updateDrinkCount(drink.name);

        // 1초 후 자판기 리셋
        setTimeout(() => {
          setCardActiveTime(0);
          resetVendingMachine(); // 자판기 리셋
        }, 1500);
      }, 1000); // 첫 1초 동안 결제 시도 중
      return;
    }

    if (paymentMethod === "cash") {
      // 현금 결제 시도
      if (totalCash >= drink.price) {
        const change = totalCash - drink.price;

        setMessage(`음료를 성공적으로 구매하셨습니다! 잔돈: ${change}원`);
        setTotalCash(change);
        // 음료 재고 감소
        updateDrinkCount(drink.name);
        if (change === 0) {
          // 잔돈 없을 경우 자판기 초기 상태로 종료
          setTimeout(() => {
            resetVendingMachine(); // 자판기 초기화
          }, 1500); // 1초 후 초기화
        }
      } else {
        setMessage("잔액이 부족합니다. 추가 금액을 넣어주세요.");
      }
      return;
    }
  };

  // 현금 투입시
  const handleInsertCash = (cash: number) => {
    const isBill = BILL_LIST.includes(cash);
    const isCoin = COIN_LIST.includes(cash);

    if (!isBill && !isCoin) {
      setMessage(
        `잘못된 ${cash < 1000 ? "동전" : "지폐"}입니다. 다시 넣어주세요.`
      );
      return;
    }
    setPaymentMethod("cash");
    setTotalCash((prev) => prev + cash);
    setMessage(`투입 금액: ${totalCash + cash}원`);
  };

  // 카드 투입시
  const handleInsertCard = () => {
    // 카드 인식 시 현금 잔액이 있다면 잔돈 반환
    if (totalCash > 0) handleRefund(true);
    setPaymentMethod("card");
    setCardActiveTime(30); // 카드 결제 활성화 타이머(30초) 시작
  };

  // 잔돈 반환 요청
  const handleRefund = (isCardProcessing: boolean = false) => {
    if (totalCash > 0) {
      setMessage(`잔돈 ${totalCash}원이 반환되었습니다.`);
      setTotalCash(0); // 잔돈 초기화
    } else {
      setMessage("반환할 잔돈이 없습니다.");
    }
    if (!isCardProcessing) {
      // 카드 처리중이 아닐 때만 자판기 초기화
      setTimeout(() => {
        resetVendingMachine();
      }, 1500); // 1초 후 초기화
    }
  };

  // 자판기 초기 상태로
  const resetVendingMachine = () => {
    setTotalCash(0);
    setMessage("");
    setPaymentMethod(undefined);
  };

  return (
    <div className="vending-machine">
      <h1>자판기</h1>
      <div>
        <h2>구매 가능한 음료</h2>
        <div className="drink-list">
          {drinkList.map((drink) => (
            <div key={drink.name}>
              <button
                onClick={() => handleSelectDrink(drink)}
                disabled={drink.count === 0} // 품절일 때 음료 버튼 비활성화
                className={`drink-button ${
                  paymentMethod === "card"
                    ? drink.count > 0 // 카드 결제 시에는 재고만 확인해서 active 처리
                      ? "active"
                      : ""
                    : paymentMethod !== null &&
                      drink.count > 0 &&
                      totalCash >= drink.price // 현금 결제 시에는 금액도 확인
                    ? "active"
                    : ""
                }`}
              >
                <img
                  src={drink.image}
                  alt={`${drink.name} 이미지`}
                  width="50"
                  height="50"
                />
                {drink.name} - {drink.price}원 ({drink.count}개 남음)
              </button>
            </div>
          ))}
        </div>
      </div>

      <h3>{message}</h3>
      {paymentMethod === "cash" ? (
        <h3>현재 잔액: {totalCash}원</h3>
      ) : paymentMethod === "card" ? (
        <h3>카드 결제: 남은 시간 {cardActiveTime}초</h3>
      ) : null}

      <InsertCashButton onInsertCash={handleInsertCash} />

      <h3>카드 결제</h3>
      <button onClick={() => handleInsertCard()}>카드 결제</button>

      <h3>잔돈 반환</h3>
      <button onClick={() => handleRefund()}>잔돈 반환 요청</button>
    </div>
  );
};

export default VendingMachine;
