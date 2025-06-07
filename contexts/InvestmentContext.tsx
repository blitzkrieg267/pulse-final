import { createContext, useContext, useState, ReactNode } from 'react';

export interface Investment {
  id: string;
  amount: number;
  returnRate: number;
  holdingTime: string;
  status: 'active' | 'completed';
  dateCreated: Date;
  expectedPayoutDate: Date;
  actualPayoutDate?: Date;
  totalReceived?: number;
}

interface InvestmentContextType {
  investments: Investment[];
  pastPayouts: Investment[];
  addInvestment: (amount: number, returnRate: number, holdingTime: string) => void;
  completeInvestment: (id: string) => void;
  getTotalInvested: () => number;
  getExpectedReturns: () => number;
  getActiveInvestmentsCount: () => number;
  getInvestmentAttempts: () => number;
  incrementInvestmentAttempts: () => void;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const [investments, setInvestments] = useState<Investment[]>([
    // Demo data
    {
      id: '1',
      amount: 500,
      returnRate: 10,
      holdingTime: '6 months',
      status: 'active',
      dateCreated: new Date('2024-01-15'),
      expectedPayoutDate: new Date('2024-07-15'),
    },
    {
      id: '2',
      amount: 1000,
      returnRate: 15,
      holdingTime: '12 months',
      status: 'active',
      dateCreated: new Date('2024-02-01'),
      expectedPayoutDate: new Date('2025-02-01'),
    }
  ]);

  const [pastPayouts, setPastPayouts] = useState<Investment[]>([
    // Demo completed investments
    {
      id: '3',
      amount: 300,
      returnRate: 5,
      holdingTime: '3 months',
      status: 'completed',
      dateCreated: new Date('2023-10-01'),
      expectedPayoutDate: new Date('2024-01-01'),
      actualPayoutDate: new Date('2024-01-01'),
      totalReceived: 315,
    },
    {
      id: '4',
      amount: 750,
      returnRate: 12,
      holdingTime: '8 months',
      status: 'completed',
      dateCreated: new Date('2023-06-01'),
      expectedPayoutDate: new Date('2024-02-01'),
      actualPayoutDate: new Date('2024-02-01'),
      totalReceived: 840,
    }
  ]);

  // Track investment attempts in current session (simulating 60-day period)
  const [investmentAttempts, setInvestmentAttempts] = useState(2); // Demo: user has made 2 attempts

  const addInvestment = (amount: number, returnRate: number, holdingTime: string) => {
    const holdingMonths = parseInt(holdingTime.split(' ')[0]);
    const expectedPayoutDate = new Date();
    expectedPayoutDate.setMonth(expectedPayoutDate.getMonth() + holdingMonths);

    const newInvestment: Investment = {
      id: Date.now().toString(),
      amount,
      returnRate,
      holdingTime,
      status: 'active',
      dateCreated: new Date(),
      expectedPayoutDate,
    };

    setInvestments(prev => [...prev, newInvestment]);
    incrementInvestmentAttempts();
  };

  const completeInvestment = (id: string) => {
    const investment = investments.find(inv => inv.id === id);
    if (investment) {
      const completedInvestment: Investment = {
        ...investment,
        status: 'completed',
        actualPayoutDate: new Date(),
        totalReceived: investment.amount * (1 + investment.returnRate / 100),
      };

      setInvestments(prev => prev.filter(inv => inv.id !== id));
      setPastPayouts(prev => [...prev, completedInvestment]);
    }
  };

  const getTotalInvested = () => {
    return investments.reduce((total, inv) => total + inv.amount, 0);
  };

  const getExpectedReturns = () => {
    return investments.reduce((total, inv) => {
      return total + (inv.amount * (inv.returnRate / 100));
    }, 0);
  };

  const getActiveInvestmentsCount = () => {
    return investments.length;
  };

  const getInvestmentAttempts = () => {
    return investmentAttempts;
  };

  const incrementInvestmentAttempts = () => {
    setInvestmentAttempts(prev => prev + 1);
  };

  return (
    <InvestmentContext.Provider value={{
      investments,
      pastPayouts,
      addInvestment,
      completeInvestment,
      getTotalInvested,
      getExpectedReturns,
      getActiveInvestmentsCount,
      getInvestmentAttempts,
      incrementInvestmentAttempts,
    }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestments() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestments must be used within an InvestmentProvider');
  }
  return context;
}