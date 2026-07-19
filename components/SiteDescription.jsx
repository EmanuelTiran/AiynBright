import Link from 'next/link';
import React from 'react';

function SiteDescription() {
    return (
        <div class="max-w-3xl mx-auto m-10 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg">
            <p class="text-lg text-gray-800 leading-relaxed mb-6">
                An exciting journey began the moment our son was born, blind from birth. Dark and light, that was his world until recently. After years of searching and experimenting, we managed to open a window to the visual world. The amazing progress that has taken place led us to establish this website, with the aim of sharing the knowledge and tools we have developed, and helping other families facing similar challenges. Our story is proof that even in an uncertain future, there is hope.
            </p>
            <p class="text-base font-sans text-gray-700 border-l-4 border-red-500 pl-4 mb-6">
                This structure provides a comprehensive platform for education, training.
            </p>
            <div class="flex items-center justify-center space-x-4">
                <Link
                    href={'/signin'}
                    replace
                    class="px-4 py-2 bg-purple-300 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-purple-600 hover:shadow-md "
                >
                    Signin
                </Link>
                <span class="text-gray-500">||</span>
                <Link
                    href={'/login'}
                    replace
                    class="px-4 py-2 bg-blue-300 text-white font-semibold rounded-lg transition duration-300 ease-in-out hover:bg-blue-600 hover:shadow-md "
                >
                    Login
                </Link>
            </div>
        </div>
    );
}

export default SiteDescription;