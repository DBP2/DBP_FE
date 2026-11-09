import { useState } from 'react';
import TradeItemCard from '@/components/trade/TradeItemCard';
import { useTrades } from '@/hooks/useTrade';
import type { TradeType } from '@/types/trade';
import './TradePage.css';
import { useNavigate } from 'react-router';
import { getTradeDetailPath } from '@/router/routes';

type FilterType = 'ALL' | TradeType;

export default function TradePage() {
  const navigate = useNavigate();
  const { data: trades = [], isPending, isError } = useTrades();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');

  if (isPending) {
    return <div className="trade-page__state">로딩 중...</div>;
  }

  if (isError) {
    return <div className="trade-page__state">거래 목록을 불러오지 못했습니다.</div>;
  }

  const filteredTrades = trades.filter((item) => {
    if (selectedFilter === 'ALL') return true;
    return item.type === selectedFilter;
  });

  const inProgressTrades = filteredTrades.filter((item) => item.status !== 'COMPLETED');
  const completedTrades = filteredTrades.filter((item) => item.status === 'COMPLETED');

  return (
    <div className="trade-page">
      <header className="trade-page__header">
        <h1 className="trade-page__title">거래</h1>
      </header>
      <div className="trade-page__filter">
        <button
          type="button"
          className={`trade-page__tab ${selectedFilter === 'ALL' ? 'trade-page__tab--active' : ''}`}
          onClick={() => setSelectedFilter('ALL')}
        >
          전체
        </button>
        <button
          type="button"
          className={`trade-page__tab ${selectedFilter === 'BUY' ? 'trade-page__tab--active' : ''}`}
          onClick={() => setSelectedFilter('BUY')}
        >
          구매
        </button>
        <button
          type="button"
          className={`trade-page__tab ${selectedFilter === 'SELL' ? 'trade-page__tab--active' : ''}`}
          onClick={() => setSelectedFilter('SELL')}
        >
          판매
        </button>
      </div>

      <div className="trade-page__content">
        <section className="trade-page__section">
          <h2 className="trade-page__section-title">
            진행 중 <span className="trade-page__count">{inProgressTrades.length}</span>
          </h2>
          {inProgressTrades.length > 0 ? (
            <div className="trade-page__list">
              {inProgressTrades.map((item) => (
                <TradeItemCard
                  key={item.id}
                  item={item}
                  onClick={() => {
                    navigate(getTradeDetailPath(item.id));
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="trade-page__empty">진행 중인 거래가 없습니다.</p>
          )}
        </section>

        <section className="trade-page__section">
          <h2 className="trade-page__section-title">
            완료 <span className="trade-page__count">{completedTrades.length}</span>
          </h2>
          {completedTrades.length > 0 ? (
            <div className="trade-page__list">
              {completedTrades.map((item) => (
                <TradeItemCard
                  key={item.id}
                  item={item}
                  onClick={() => {
                    navigate(getTradeDetailPath(item.id));
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="trade-page__empty">완료된 거래가 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
}
