import MailchimpSubscribe from 'react-mailchimp-subscribe';
import NewsletterForm from './NewsletterForm.js';

const NewsletterSubscribe = () => {

  const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL || "https://sonicacts.us6.list-manage.com/subscribe/post?u=f8f2c0dae61384c2dba08e8ec&amp;id=87c02476f0&amp;v_id=3600&amp;f_id=004733e3f0";

  return (
    <div className='newsletter-subscribe'>
      <MailchimpSubscribe
        url={ MAILCHIMP_URL }
        render={ ( props ) => {
          const { subscribe, status, message } = props || {};
          return (
            <NewsletterForm
              status={ status }
              message={ message }
              onValidated={ formData => subscribe( formData ) }
            />
          );
        } }
      />
    </div>
  );
};

export default NewsletterSubscribe;