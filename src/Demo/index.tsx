import React, { useEffect } from 'react';
import Jack from './jack';

import swagger from './swagger.json';

export default () => {

  useEffect(() => {
    test();
  }, []);

  const test = async () => {
    const jack = new Jack(swagger);

    const res = await jack.get_version();

    console.log('[res]', res);
  }

  return (
    <div>
      Jack
    </div>
  );
}
