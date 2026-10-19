import type { Transaction } from "../transactions.type";
import {
  formatTransactionAmount,
  formatTransactionDateTime,
} from "../transactions.utils";
import StatusBadge from "../../../shared/components/statusBadge/statusBadge";

interface TransactionMobileCardProps {
  transaction: Transaction;
}

export default function TransactionMobileCard({
  transaction,
}: TransactionMobileCardProps) {
  return (
    <article className="rounded-xl border border-c-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={transaction.avatar || "/images/users/user1.jpg"}
            alt=""
            className="size-10 shrink-0 rounded-full bg-c-background object-cover"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-c-text">
              {transaction.customer}
            </p>
            <p className="mt-1 truncate text-xs text-c-text-muted">
              {transaction.id}
            </p>
          </div>
        </div>

        <StatusBadge status={transaction.status} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-c-border pt-3">
        <div>
          <p className="text-xs text-c-text-muted">Amount</p>
          <p className="mt-1 text-sm font-bold text-c-text">
            {formatTransactionAmount(transaction.amount)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-c-text-muted">Order</p>
          <p className="mt-1 text-sm font-medium text-c-text-secondary">
            {transaction.orderId}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-c-text-muted">
        {formatTransactionDateTime(transaction.createdAt)}
      </p>
    </article>
  );
}