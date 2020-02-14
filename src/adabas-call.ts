/*
 * Copyright © 2019-2020 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

import * as ffi from 'ffi';
import * as os from 'os';
import * as ref from 'ref';
import * as ArrayType from 'ref-array';

import { PayloadData } from './interfaces';
export class AdabasCall {

    adalnkx: any;
    // private log: string[];
    // adalnk: any;

    constructor(log: string[] = []) {
        // this.adalnk = adalnk;
        console.log(log);
        // this.log = log;
        const libName = (os.platform() == 'win32') ? 'adalnkx' : 'libadalnkx.so';
    
        const abd = ref.types.void; 
        const abdPtr = ref.refType(abd);
        const abdArray = ArrayType(abdPtr);

        // binding to a few "adalnkx" functions...
        this.adalnkx = ffi.Library(libName, {
            'adabasx': ['int', ['pointer', 'int', abdArray]]
        });

    }

    call(payload: PayloadData): Promise<PayloadData> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('cb: ', payload.cb.toString('before'));
                payload.abda.dump();
                console.log('adba:', payload.abda.get());
                const abd: Buffer[] = [];
                payload.abda.get().forEach( buf => {
                    abd.push(buf.buffer);
                })
                this.adalnkx.adabasx(payload.cb.acbx, payload.abda.len(), abd);
                console.log('cb: ', payload.cb.toString('after'));
                payload.abda.dump();
                resolve(payload);
            } catch (error) {
                reject(error);
            }
        });
    }

}
