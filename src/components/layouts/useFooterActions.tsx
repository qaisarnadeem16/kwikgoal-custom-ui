import React, { useState } from 'react';
import { useZakeke } from 'zakeke-configurator-react';
import useStore from '../../Store';
import { T } from '../../Helpers';
import { useDialogManager, MessageDialog } from '../dialog/Dialogs';
import ErrorDialog from '../dialog/ErrorDialog';
import PdfDialog from '../dialog/PdfDialog';
import QuotationFormDialog from '../dialog/QuotationFormDialog';
import { CustomQuotationConfirmMessage } from './LayoutStyled';

// Shared between the Footer and the main-menu "Next Step" panel so Download /
// Get a Quote behave identically wherever they're triggered from.
export const useFooterActions = () => {
	const { getPDF, product, saveComposition, createQuote, setCameraByName } = useZakeke();
	const { setIsLoading, isQuoteLoading, setIsQuoteLoading } = useStore();
	const { showDialog, closeDialog } = useDialogManager();

	const [pdfIsLoading, setPdfIsLoading] = useState<boolean>(false);

	const showError = (error: string) => {
		showDialog('error', <ErrorDialog error={error} onCloseClick={() => closeDialog('error')} />);
	};

	const handlePdfClick = async () => {
		try {
			setIsLoading(true);
			setPdfIsLoading(true);
			const url = await getPDF();
			showDialog('pdf', <PdfDialog url={url} onCloseClick={() => closeDialog('pdf')} />);
		} catch (ex) {
			console.error(ex);
			showError(T._('Failed PDF generation', 'Composer'));
		} finally {
			setPdfIsLoading(false);
			setIsLoading(false);
		}
	};

	const handleSubmitRequestQuote = async (formData: any) => {
		try {
			closeDialog('request-quotation');
			setIsQuoteLoading(true);
			setCameraByName('buy_screenshot_camera', false, false);
			await saveComposition();
			await createQuote(formData);
			showDialog(
				'message',
				<MessageDialog
					windowDecorator={CustomQuotationConfirmMessage}
					message={T._('Request for quotation sent successfully', 'Composer')}
				/>
			);
			setIsQuoteLoading(false);
		} catch (ex) {
			console.error(ex);
			setIsQuoteLoading(false);
			showDialog(
				'error',
				<ErrorDialog
					error={T._(
						'An error occurred while sending request for quotation. Please try again.',
						'Composer'
					)}
					onCloseClick={() => closeDialog('error')}
				/>
			);
		}
	};

	const handleGetQuoteClick = async () => {
		const rule = product?.quoteRule;
		if (rule)
			showDialog(
				'request-quotation',
				<QuotationFormDialog getQuoteRule={rule} onFormSubmit={handleSubmitRequestQuote} />
			);
	};

	return { handlePdfClick, handleGetQuoteClick, pdfIsLoading, isQuoteLoading };
};
