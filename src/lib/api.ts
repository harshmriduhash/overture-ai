export const postUpgradeSubscription = async (
  plan: string,
  userSubscription: any,
) => {
  const response = await fetch("/api/subscription/upgrade", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, userSubscription }),
  });
  return response.json();
};

export const postInitiatePayment = async (values: any) => {
  const response = await fetch("/api/subscription/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) throw new Error("Failed to initiate payment");
  return response.json();
};
