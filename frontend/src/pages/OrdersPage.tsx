import { FormEvent, UIEvent, WheelEvent, useCallback, useEffect, useRef, useState } from "react";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Loader from "../components/ui/Loader";
import { getErrorMessage } from "../services/http";
import { orderApi } from "../services/orderApi";
import { Order } from "../types/order";

const ORDERS_PAGE_SIZE = 5;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextPage, setNextPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const [itemName, setItemName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const isLoadingMoreRef = useRef(false);

  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const loadOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setLoadError("");
    try {
      const response = await orderApi.getMyOrders(0, ORDERS_PAGE_SIZE);
      setOrders(response.content);
      setNextPage(response.page + 1);
      setTotalOrders(response.totalElements);
      setHasMoreOrders(response.hasNext);
    } catch (requestError) {
      setLoadError(getErrorMessage(requestError));
      setHasMoreOrders(false);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const loadMoreOrders = useCallback(async () => {
    if (isLoadingOrders || !hasMoreOrders || isLoadingMoreRef.current) {
      return;
    }

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadError("");

    try {
      const response = await orderApi.getMyOrders(nextPage, ORDERS_PAGE_SIZE);
      setOrders((previous) => [...previous, ...response.content]);
      setNextPage(response.page + 1);
      setTotalOrders(response.totalElements);
      setHasMoreOrders(response.hasNext);
    } catch (requestError) {
      setLoadError(getErrorMessage(requestError));
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasMoreOrders, isLoadingOrders, nextPage]);

  const handleOrdersScroll = (event: UIEvent<HTMLDivElement>) => {
    if (!hasMoreOrders) {
      return;
    }

    const element = event.currentTarget;
    const isNearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 24;

    if (isNearBottom) {
      void loadMoreOrders();
    }
  };

  const handleOrdersWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!hasMoreOrders || event.deltaY <= 0) {
      return;
    }

    const element = event.currentTarget;
    const hasOverflow = element.scrollHeight > element.clientHeight + 1;

    // If the first page exactly fills the area (no overflow yet),
    // treat wheel down as "load more" so scrolling can continue.
    if (!hasOverflow) {
      void loadMoreOrders();
    }
  };

  const handleCreateOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCreateError("");
    setCreateSuccess("");

    const normalizedItemName = itemName.trim();
    const amount = Number(totalAmount);

    if (!normalizedItemName) {
      setCreateError("Item name is required.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setCreateError("Total amount must be a number greater than 0.");
      return;
    }

    setIsCreatingOrder(true);
    try {
      await orderApi.createOrder({
        itemName: normalizedItemName,
        totalAmount: amount
      });
      await loadOrders();
      setItemName("");
      setTotalAmount("");
      setCreateSuccess("Order created successfully.");
    } catch (requestError) {
      setCreateError(getErrorMessage(requestError));
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Create new orders and review your recent order history.</p>
      </header>

      <div className="orders-layout">
        <Card title="Create New Order" subtitle="Submit item name and total amount" className="order-form-card">
          <form className="stack" onSubmit={handleCreateOrder}>
            <InputField
              id="itemName"
              label="Item Name"
              placeholder="e.g. Keyboard"
              value={itemName}
              onChange={(event) => setItemName(event.target.value)}
            />

            <InputField
              id="totalAmount"
              label="Total Amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 150.75"
              value={totalAmount}
              onChange={(event) => setTotalAmount(event.target.value)}
            />

            {createError ? <Alert variant="error" message={createError} /> : null}
            {createSuccess ? <Alert variant="success" message={createSuccess} /> : null}

            <Button type="submit" isLoading={isCreatingOrder} className="h-10">
              Create Order
            </Button>
          </form>
        </Card>

        <Card title="Order History" subtitle="Most recent orders first" className="order-history-card">
          {isLoadingOrders ? <Loader label="Loading orders..." /> : null}
          {loadError ? <Alert variant="error" message={loadError} /> : null}

          {!isLoadingOrders && !loadError && orders.length === 0 ? (
            <p className="muted">No orders found.</p>
          ) : null}

          {!isLoadingOrders && orders.length > 0 ? (
            <div className="orders-table-wrap">
              <div className="orders-scroll-area" onScroll={handleOrdersScroll} onWheel={handleOrdersWheel}>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Item Name</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="order-id">#{order.id}</td>
                        <td>{order.itemName || "-"}</td>
                        <td>{formatCurrency(Number(order.totalAmount))}</td>
                        <td>
                          <span className="status-badge">{order.status}</span>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="muted orders-visible-count">
                Showing {orders.length} of {Math.max(totalOrders, orders.length)} orders.
              </p>

              {isLoadingMore ? (
                <p className="muted orders-scroll-hint">Loading more orders...</p>
              ) : null}

              {!isLoadingMore && hasMoreOrders ? (
                <div className="orders-scroll-hint">
                  Scroll down to load more orders...
                </div>
              ) : null}

              {!isLoadingMore && !hasMoreOrders ? (
                <p className="muted orders-scroll-hint">All orders are displayed.</p>
              ) : null}
            </div>
          ) : null}
        </Card>
      </div>
    </section>
  );
}
