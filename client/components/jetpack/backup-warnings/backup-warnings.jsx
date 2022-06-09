import { Gridicon } from '@automattic/components';
import { translate } from 'i18n-calypso';
import PropTypes from 'prop-types';
import BackupWarningHeader from 'calypso/components/jetpack/backup-warnings/backup-warning-header';
import BackupWarningListHeader from 'calypso/components/jetpack/backup-warnings/backup-warning-list-header';
import LogItem from 'calypso/components/jetpack/log-item';
import { getBackupWarnings } from 'calypso/lib/jetpack/backup-utils';

import './style.scss';

// If code specific info doesn't exist, fall back to category
const getWarningInfo = ( code, category ) => {
	const retryMessage =
		' ' +
		translate(
			"After that, If you'd like to restart the backup click “retry”, or let it resolve on its own."
		);

	const warningCategoryInfo = {
		GENERIC: translate( 'If you\'d like to restart the backup click "retry".' ),
		PERMISSIONS:
			translate( 'Ensure the account has read access to the listed files.' ) + retryMessage,
		CONNECTION:
			translate(
				'The connection may have been interrupted. Ensure the site is accessible and credentials are correct.'
			) + retryMessage,
		TRANSIENT:
			translate( 'You can fix transient file errors by adding a .donotbackup file.' ) +
			retryMessage,
		DATABASE:
			translate(
				'Ensure your database credentials have proper access to your database and your tables are not corrupt.'
			) + retryMessage,
	};

	const warningCodeInfo = {
		// Generic - Anything with an undefined code
		GENERIC: null,

		// Permissions
		PERMISSION_DENIED: null,
		UNABLE_TO_OPEN_FILE: null,

		// Connection
		SERIOUS_ROW_COUNT_MISMATCH: null,
		TIMEOUT: null,
		UNABLE_TO_CONNECT_TO_ANY_TARGET: null,
		UNABLE_TO_START_SUBSYSTEM: null,
		CONNECTION_REFUSED: null,
		NO_RESPONSE_FROM_SERVER: null,
		CONNECTION_ERROR_CODE_SSH: null,
		TRANSPORT_SERVER_API_TIMED_OUT: null,
		HTTP_ERROR_4XX_CLIENT_ERROR: null,
		HTTP_ERROR_408_REQUEST_TIMEOUT: null,
		HTTP_ERROR_5XX_SERVER_ERROR: null,
		HTTP_ERROR_502_BAD_GATEWAY: null,
		HTTP_ERROR_503_SERVICE_UNAVAILABLE: null,
		HTTP_ERROR_520_EMPTY_OR_UNEXPECTED_ERROR: null,
		HTTP_ERROR_524_TIMEOUT_OCCURRED: null,

		// Transient
		FILE_NOT_FOUND: null,
		DOWNLOADED_FILE_HAS_BAD_SIZE: null,
		NO_SUCH_FILE: null,
		HTTP_ERROR_3XX_REDIRECTION: null,
		HTTP_ERROR_302_FOUND: null,

		// Database
		SELECT_COMMAND_DENIED_TO_USER: null,
		TABLE_MARKED_AS_CRASHED: null,
		TABLE_MARKED_AS_CRASHED_LAST_REPAIR_FAILED: null,
	};

	let warningInfo = warningCategoryInfo.GENERIC;

	if ( warningCodeInfo.hasOwnProperty( code ) && warningCodeInfo[ code ] !== null ) {
		warningInfo = warningCodeInfo[ code ];
	} else if (
		warningCategoryInfo.hasOwnProperty( category ) &&
		warningCategoryInfo[ category ] !== null
	) {
		warningInfo = warningCategoryInfo[ category ];
	}

	return warningInfo;
};

const BackupWarnings = ( { backup } ) => {
	if ( ! backup ) {
		return <></>;
	}

	const warnings = getBackupWarnings( backup );
	const hasWarnings = Object.keys( warnings ).length !== 0;

	if ( ! hasWarnings ) {
		return <></>;
	}

	const logItems = [];
	Object.keys( warnings ).forEach( ( warningCode ) => {
		const fileList = [];
		warnings[ warningCode ].items.forEach( ( item ) => {
			fileList.push( <li key={ item.item }> { item.item } </li> );
		} );
		logItems.push(
			<LogItem
				key={ warningCode }
				className="backup-warnings__warning-item"
				header={
					<BackupWarningHeader warning={ warnings[ warningCode ] } warningCode={ warningCode } />
				}
			>
				<ul className="backup-warnings__file-list">{ fileList }</ul>
				<div className="backup-warnings__info">
					<Gridicon icon="help-outline" />
					<div className="backup-warnings__info-text">
						{ getWarningInfo( warningCode, warnings[ warningCode ].category ) }
					</div>
				</div>
			</LogItem>
		);
	} );

	return (
		<>
			<BackupWarningListHeader />
			{ logItems }
		</>
	);
};

BackupWarnings.propTypes = {
	backup: PropTypes.object,
};

export default BackupWarnings;