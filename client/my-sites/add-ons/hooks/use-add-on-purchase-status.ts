import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import { getSitePurchases } from 'calypso/state/purchases/selectors/get-site-purchases';
import siteHasFeature from 'calypso/state/selectors/site-has-feature';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import type { AddOnMeta } from './use-add-ons';

/**
 * Returns whether add-on product has been purchased or included in site plan.
 */
const useAddOnPurchaseStatus = ( { productSlug, featureSlugs }: AddOnMeta ) => {
	const translate = useTranslate();

	const { purchased, isSiteFeature } = useSelector( ( state ) => {
		const selectedSite = getSelectedSite( state );
		const sitePurchases = getSitePurchases( state, selectedSite?.ID );
		return {
			purchased: sitePurchases.find( ( product ) => product.productSlug === productSlug ),
			isSiteFeature:
				selectedSite &&
				featureSlugs?.find( ( slug ) => siteHasFeature( state, selectedSite?.ID, slug ) ),
		};
	} );

	/*
	 * Order matters below:
	 * 	1. Check if purchased first.
	 * 	2. Check if site feature next.
	 * Reason: `siteHasFeature` involves both purchases and plan features.
	 */

	if ( purchased ) {
		return { available: false, text: translate( 'Purchased' ) };
	}

	if ( isSiteFeature ) {
		return { available: false, text: translate( 'Included in your plan' ) };
	}

	return { available: true };
};

export default useAddOnPurchaseStatus;