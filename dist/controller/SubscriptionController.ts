import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51IiysYSIB5kR6HedNShfOuM0PHmLGTRwvmRFsCPTg9umrpa3sJrMR2waEHigJWsxmiXsGwbHELk4DZ0DzeUcVFAj00BAcLPAHy",
  { apiVersion: "2020-08-27", typescript: true }
);

//? Helpers
import { error, sendErrorMessage, sendMessage } from "../helpers/helpers";

export const createSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    let { name, description, currency, unit_amount } = req.body;

    let id = uuidv4();

    const product = await stripe.products.create({
      id,
      name,
      description,
      active: true,
    });

    const price = await stripe.prices.create({
      unit_amount: unit_amount,
      currency: currency,
      recurring: { interval: "month" },
      product: id,
      active: true,
    });

    return sendMessage(req, res, {
      message: "Product Created Successfully!",
      data: product,
      price,
    });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err, 400);
  }
};

export const getSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    let { productId ,priceId} = req.params;
    console.log(productId,priceId)

    if (!productId || productId == null || productId == undefined && !priceId) {
      return sendMessage(req, res, {
        data: { message: "Please Enter Id First!" },
      });
    }else{
      let product = await stripe.products.retrieve(productId);
      const price = await stripe.prices.retrieve(priceId);
      // let prices = await stripe.prices.retrieve(id)
      if (product) {

        let data = {product,price}

        res.status(200).json({message:'Find Success !',data})
      }
    }
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    let products = await stripe.products.list({
      limit: 5,
      active: true,
    });

    let prices = await stripe.prices.list({
      limit: 3,
    });

    let data: any = [];

    products.data.map((product) => {
      prices.data.map((price) => {
        if (product.id == price.product) {
          data.push({ product, price });
        }
      });
    });

    return sendMessage(req, res, {
      message: "All Products Fetched Successfully!",
      count: products?.data?.length,
      data: { data: data },
    });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  console.log(req.body)
  try {

    const {name, unit_amount, description, currency} = req.body

    let { productId, priceId } = req.params;

    if (!productId || productId == null || productId == undefined) {
      return sendMessage(req, res, {
        data: { message: "Please Enter Id First!" },
      });
    }

    const product = await stripe.products.update(productId, {name:name,description:description});

    return sendMessage(req, res, {
      message: "Product Updated Successfully!",
      data: { product },
    });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const deleteSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    if (!id || id == null || id == undefined) {
      return sendMessage(req, res, {
        data: { message: "Please Enter Id First!" },
      });
    }

    const product = await stripe.products.update(id, { active: false });

    return sendMessage(req, res, {
      message: "Product Deleted Successfully!",
      data: { product },
    });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  let { name, email, phone } = req.body;

  const customer = await stripe.customers.create({
    name,
    email,
    phone,
  });

  try {
    return sendMessage(req, res, {
      message: "Customer Created Successfully",
      customer,
    });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const purchaseSubscription = async (req: Request, res: Response) => {
  try {
    let { customer, price } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customer,
      items: [{ price: price, quantity: 1 }],
    });

    // const invoice = await stripe.invoices.create({
    //   customer: customer,
    //   collection_method: "charge_automatically",
    // });

    return sendMessage(req, res, {
      message: "Subscription Created Purchased!",
      data: { subscription },
    });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const saveCard = async (req: Request, res: Response) => {
  try {
    let { number, exp_year, exp_month, cvc, customer } = req.body;

    let card = {
      number,
      exp_year,
      exp_month,
      cvc,
    };

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card,
    });

    const updatedPaymentMethod = await stripe.paymentMethods.attach(
      paymentMethod.id,
      { customer: customer }
    );

    const updateCustomerDefaultPaymentMethod = await stripe.customers.update(
      customer,
      {
        invoice_settings: {
          default_payment_method: paymentMethod.id, // <-- your payment method ID collected via Stripe.js
        },
      }
    );

    console.log({ paymentMethod, updatedPaymentMethod });

    return sendMessage(
      req,
      res,
      {
        data: {
          message: "Card Saved Successfully!",
          paymentMethod,
          updatedPaymentMethod,
          updateCustomerDefaultPaymentMethod,
        },
      },
      201
    );
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await stripe.customers.list({
      limit: 3,
    });

    return sendMessage(req, res, { data: { customers } });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};

export const getCustomerPaymentMethods = async (
  req: Request,
  res: Response
) => {
  try {
    let { customer } = req.body;

    const paymentMethods = await stripe.customers.listPaymentMethods(customer, {
      type: "card",
    });

    sendMessage(req, res, { data: { paymentMethods } });
  } catch (err: any) {
    error({ err });
    return sendErrorMessage(req, res, err);
  }
};
