import React, { useEffect } from 'react';
import Jack from './jack';

import swagger from './swagger.json';

export default () => {

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    const jack = new Jack(swagger);

    console.log('[jack]', jack);

    const res = await jack.getVersion();

    console.log('[res]', res);
  }

  return (
    <div>
      Jack
    </div>
  );
}
