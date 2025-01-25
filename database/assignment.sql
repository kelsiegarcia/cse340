-- 1.

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
) 
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);

-- 2.

UPDATE public.account 
	SET account_type = 'Admin'
	WHERE account_email = 'tony@starkent.com'	

-- 3.

DELETE 
FROM
	public.account
WHERE 
	account_email = 'tony@starkent.com'

-- 4.
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--5.
SELECT inv_make, inv_model, classification.classification_id
FROM inventory AS inv
INNER JOIN classification ON inv.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--6.
UPDATE public.inventory
SET inv_image = CONCAT(SUBSTRING(inv_image, 1, 8), 'vehicles/', SUBSTRING(inv_image, 9)),
	inv_thumbnail = CONCAT(SUBSTRING(inv_thumbnail, 1, 8), 'vehicles/', SUBSTRING(inv_thumbnail, 9));

