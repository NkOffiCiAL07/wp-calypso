import { SubscriptionManager } from '@automattic/data-stores';
import classNames from 'classnames';
import { useTranslate } from 'i18n-calypso';
import { useMemo } from 'react';
import PopoverMenuItem from 'calypso/components/popover-menu/item';
import SegmentedControl from 'calypso/components/segmented-control';
import type { SiteSubscriptionDeliveryFrequency } from '@automattic/data-stores/src/reader/types';

type DeliveryFrequencyOptionProps = {
	children: React.ReactNode;
	value: SiteSubscriptionDeliveryFrequency;
	selected: boolean;
	onChange: ( value: SiteSubscriptionDeliveryFrequency ) => void;
};

const DeliveryFrequencyOption = ( {
	children,
	selected,
	value,
	onChange,
}: DeliveryFrequencyOptionProps ) => (
	<SegmentedControl.Item selected={ selected } onClick={ () => onChange( value ) }>
		{ children }
	</SegmentedControl.Item>
);

type DeliveryFrequencyInputProps = {
	onChange: ( value: SiteSubscriptionDeliveryFrequency ) => void;
	value: SiteSubscriptionDeliveryFrequency;
	isUpdating: boolean;
};

type DeliveryFrequencyKeyLabel = {
	key: SiteSubscriptionDeliveryFrequency;
	label: string;
};

const DeliveryFrequencyInput = ( {
	onChange,
	value: selectedValue,
	isUpdating,
}: DeliveryFrequencyInputProps ) => {
	const { isLoggedIn } = SubscriptionManager.useIsLoggedIn();
	const translate = useTranslate();
	const availableFrequencies = useMemo< DeliveryFrequencyKeyLabel[] >(
		() => [
			{
				key: 'instantly',
				label: translate( 'Instantly' ),
			},
			{
				key: 'daily',
				label: translate( 'Daily' ),
			},
			{
				key: 'weekly',
				label: translate( 'Weekly' ),
			},
		],
		[ translate ]
	);

	return (
		<PopoverMenuItem
			itemComponent="div"
			className={ classNames( 'settings-popover__delivery-frequency-item', {
				'is-logged-in': isLoggedIn,
			} ) }
		>
			{ ! isLoggedIn && (
				<p className="settings-popover__item-label">{ translate( 'Email me new posts' ) }</p>
			) }
			<SegmentedControl
				className={ classNames( 'settings-popover__delivery-frequency-control', {
					'is-loading': isUpdating,
				} ) }
			>
				{ availableFrequencies.map( ( { key, label }, index ) => (
					<DeliveryFrequencyOption
						selected={ selectedValue === key }
						value={ key }
						onChange={ onChange }
						key={ index }
					>
						{ label }
					</DeliveryFrequencyOption>
				) ) }
			</SegmentedControl>
		</PopoverMenuItem>
	);
};

export default DeliveryFrequencyInput;
